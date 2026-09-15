import React, { useState, useRef, useEffect } from "react";

const AiChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your medical assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // const apiKey = process.env.DEEPSEEK_API_KEY; // Replace with your actual API key

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
          }),
        }
      );


      // const response = await fetch(
      //   "https://api.deepseek.com/v1/chat/completions",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       // Authorization: `Bearer ${apiKey}`,
      //     },
      //     body: JSON.stringify({
      //       model: "deepseek-chat",
      //       messages: [...messages, userMessage],
      //       max_tokens: 300,
      //     }),
      //   }
      // );

      // if (!response.ok) {
      //   throw new Error(`API request failed with status ${response.status}`);
      // }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed: ${response.status}`);
      }

      const assistantMessage = {
        role: "assistant",
        content: data.content,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);

      
      // const assistantMessage = {
      //   role: "assistant",
      //   content: data.choices[0].message.content,
      // };
      // setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Sorry I am in Working phase. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen  mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <h3 className="font-medium">Medical Assistant</h3>
      </div>

      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-3 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${
                message.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left mb-3">
            <div className="inline-block px-4 py-2 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-3 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your health question here..."
          className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg font-medium transition-colors disabled:bg-blue-400"
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AiChatBot;
