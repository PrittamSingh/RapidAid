import React, { useState } from "react";

const symptomData = {
  fever: {
    description:
      "Fever is usually a sign of infection. Stay hydrated and rest well.",
    medicines: ["Paracetamol", "Ibuprofen", "Crocin"],
    note: "See a doctor if fever persists beyond 3 days or crosses 103°F.",
  },
  cough: {
    description: "Cough may be caused by cold, allergies, or infections.",
    medicines: ["Benadryl", "Dextromethorphan", "Cough Syrup"],
    note: "Dry cough and wet cough may need different treatment.",
  },
  headache: {
    description: "Often due to stress, dehydration, or lack of sleep.",
    medicines: ["Paracetamol", "Aspirin", "Disprin"],
    note: "Seek medical advice for chronic or severe headaches.",
  },
  cold: {
    description: "Caused by viruses, usually resolves in a few days.",
    medicines: ["Cetirizine", "Vitamin C", "Steam inhalation"],
    note: "Drink warm fluids and rest well.",
  },
  bodyPain: {
    description:
      "General body pain could result from fatigue or viral infection.",
    medicines: ["Paracetamol", "Ibuprofen", "Flexon"],
    note: "Consult a doctor if pain is unexplained or severe.",
  },
  stomachAche: {
    description: "Caused by indigestion, gas, or infection.",
    medicines: ["Digene", "Pantoprazole", "Cyclopam"],
    note: "Avoid spicy food and drink water. Seek medical help for severe pain.",
  },
  soreThroat: {
    description: "Common with viral infections, allergies or flu.",
    medicines: ["Salt water gargle", "Strepsils", "Warm fluids"],
    note: "Consult a doctor if pain or difficulty swallowing increases.",
  },
  diarrhea: {
    description:
      "Frequent loose stools often due to infection or food poisoning.",
    medicines: ["ORS", "Loperamide", "Probiotics"],
    note: "Stay hydrated and avoid solid food initially.",
  },
  nausea: {
    description: "Feeling of vomiting due to infection or stomach issues.",
    medicines: ["Ondansetron", "Domperidone", "Emeset"],
    note: "Take small sips of water and rest.",
  },
  allergy: {
    description: "Could be due to food, dust, or pollen.",
    medicines: ["Cetirizine", "Loratadine", "Antihistamines"],
    note: "Identify and avoid the allergen.",
  },
};

const MedicineSuggestion = () => {
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState(null);

  const handleSearch = () => {
    const keyword = input.toLowerCase().replace(/\s/g, "");
    const match = Object.keys(symptomData).find((key) =>
      keyword.includes(key.toLowerCase())
    );
    if (match) {
      setSuggestion(symptomData[match]);
    } else {
      setSuggestion({
        description:
          "No exact match found. Try selecting a listed symptom or enter a common one.",
        medicines: [],
        note: "This tool is for general suggestions only. Consult a doctor for accurate treatment.",
      });
    }
  };

  const handleSymptomClick = (symptom) => {
    setInput(symptom);
    const match = Object.keys(symptomData).find((key) => key === symptom);
    if (match) setSuggestion(symptomData[match]);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
        💊 Medicine Suggestions by Symptom
      </h1>

      {/* Input area */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter a symptom (e.g., fever, cold)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Suggest
        </button>
      </div>

      {/* Symptom list */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg text-gray-700 mb-2">
          🔍 Quick Symptom Select:
        </h2>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {Object.keys(symptomData).map((symptom, i) => (
            <button
              key={i}
              onClick={() => handleSymptomClick(symptom)}
              className="px-3 py-1 bg-gray-200 rounded-full hover:bg-blue-100 text-sm capitalize"
            >
              {symptom.replace(/([A-Z])/g, " $1").toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {suggestion && (
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-300">
          <p className="mb-3 text-gray-800 font-medium">
            {suggestion.description}
          </p>
          {suggestion.medicines.length > 0 && (
            <>
              <h3 className="text-blue-700 font-semibold text-lg mb-2">
                💡 Suggested Medicines:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {suggestion.medicines.map((med, i) => (
                  <li key={i}>{med}</li>
                ))}
              </ul>
            </>
          )}
          <p className="text-sm text-gray-600 italic mt-3">{suggestion.note}</p>
        </div>
      )}
    </div>
  );
};

export default MedicineSuggestion;
