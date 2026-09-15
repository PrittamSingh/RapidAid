const express = require("express");

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: "Messages are required." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      message: "Gemini_API_KEY is not configured on the server.",
    });
  }

  const allowedMessages = messages
    .filter(
      (message) =>
        ["user", "assistant"].includes(message.role) &&
        typeof message.content === "string"
    )
    .slice(-20);

  try {
    const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY,
            },
            body: JSON.stringify({
            systemInstruction: {
                parts: [
                {
                    text: "You are a helpful medical-information assistant. Do not diagnose or prescribe medicine. For emergencies, advise the user to contact emergency services or a qualified clinician.",
                },
                ],
            },
            contents: allowedMessages.map((message) => ({
                role: message.role === "assistant" ? "model" : "user",
                parts: [{ text: message.content }],
            })),
            generationConfig: {
                maxOutputTokens: 300,
            },
            }),
        }
        );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error("Gemini error:", data);
      return res.status(geminiResponse.status).json({
        message: data.error?.message || "Gemini request failed.",
      });
    }

    const content = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("");

    if (!content) {
      return res.status(502).json({
        message: "Gemini returned an empty response.",
      });
    }

    return res.status(200).json({ content });
  } catch (error) {
    console.error("Gemini connection error:", error);
    return res.status(502).json({
      message: "Could not connect to the AI service.",
    });
  }
});

module.exports = router;