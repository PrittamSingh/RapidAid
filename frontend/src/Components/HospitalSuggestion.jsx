import React, { useState, useEffect } from "react";

const HospitalSuggestion = () => {
  const [symptom, setSymptom] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Map common symptoms to relevant medical specialties/facilities
  const symptomToSpecialty = {
    fever: ["general hospital", "internal medicine", "urgent care"],
    cough: ["pulmonology", "respiratory", "general hospital", "urgent care"],
    headache: ["neurology", "general hospital", "urgent care"],
    "stomach pain": ["gastroenterology", "general hospital", "urgent care"],
    "back pain": ["orthopedic", "physical therapy", "pain clinic"],
    rash: ["dermatology", "general hospital", "urgent care"],
    "chest pain": ["cardiology", "emergency room", "general hospital"],
    "broken bone": ["orthopedic", "emergency room"],
    "eye problem": ["ophthalmology", "eye clinic"],
    "ear pain": ["ent", "otolaryngology", "urgent care"],
    "tooth pain": ["dental", "dentist"],
    pregnancy: ["obstetrics", "gynecology", "women's health"],
    "mental health": ["psychiatry", "psychology", "mental health clinic"],
    // Add more mappings as needed
  };

  const handleSearch = () => {
    if (!symptom) return;
    setLoading(true);
    setError("");

    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Search for both hospitals and relevant specialty clinics based on symptom
        try {
          // First find hospitals and clinics nearby
          const searchTerms = ["hospital", "clinic", "medical center"];
          const results = [];

          for (const term of searchTerms) {
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${term}&format=json&limit=15&addressdetails=1&extratags=1&viewbox=${
                  longitude - 0.1
                },${latitude - 0.1},${longitude + 0.1},${
                  latitude + 0.1
                }&bounded=1`
              );

              if (!response.ok)
                throw new Error(`HTTP error ${response.status}`);

              const data = await response.json();
              results.push(...data);
            } catch (err) {
              console.error(`Error fetching ${term}:`, err);
            }
          }

          // Remove duplicates by osm_id
          const uniqueResults = Array.from(
            new Map(results.map((item) => [item.osm_id, item])).values()
          );

          setHospitals(uniqueResults);
          filterHospitalsBySymptom(uniqueResults, symptom);
        } catch (err) {
          console.error("Error fetching medical facilities:", err);
          setError(
            "Failed to fetch medical facilities. Please try again later."
          );
        }
        setLoading(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLoading(false);
        setError(
          "Location access is required to find nearby medical facilities."
        );
      }
    );
  };

  const filterHospitalsBySymptom = (allHospitals, userSymptom) => {
    // Convert symptom to lowercase for case-insensitive matching
    const symptomLower = userSymptom.toLowerCase();

    // Find relevant specialties for this symptom
    let relevantSpecialties = [];

    // Check for exact matches first
    if (symptomToSpecialty[symptomLower]) {
      relevantSpecialties = symptomToSpecialty[symptomLower];
    } else {
      // Check for partial matches
      for (const [key, specialties] of Object.entries(symptomToSpecialty)) {
        if (symptomLower.includes(key) || key.includes(symptomLower)) {
          relevantSpecialties.push(...specialties);
        }
      }
    }

    // If no specialties matched, default to general hospitals
    if (relevantSpecialties.length === 0) {
      relevantSpecialties = ["general hospital", "urgent care", "clinic"];
    }

    // Filter and rank hospitals based on relevance to symptom
    const filtered = allHospitals.map((hospital) => {
      // Calculate relevance score
      let relevanceScore = 0;

      // Check name and tags for relevant keywords
      const name = hospital.display_name.toLowerCase();

      for (const specialty of relevantSpecialties) {
        if (name.includes(specialty.toLowerCase())) {
          relevanceScore += 10;
        }
      }

      // Check if it's a general hospital (good for most symptoms)
      if (name.includes("hospital") && !name.includes("veterinary")) {
        relevanceScore += 5;
      }

      // Check for emergency services (important for urgent symptoms)
      if (name.includes("emergency") || name.includes("urgent care")) {
        relevanceScore += 3;
      }

      // Add more relevance checks based on the OSM tags if available
      if (hospital.extratags) {
        if (hospital.extratags.healthcare) {
          relevanceScore += 2;
        }

        if (hospital.extratags.emergency === "yes") {
          relevanceScore += 3;
        }
      }

      // Return hospital with its relevance score
      return {
        ...hospital,
        relevanceScore,
      };
    });

    // Sort by relevance score (highest first)
    filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Take the top results
    setFilteredHospitals(filtered.slice(0, 10));
  };

  // When symptom changes, refilter existing hospitals
  useEffect(() => {
    if (hospitals.length > 0 && symptom) {
      filterHospitalsBySymptom(hospitals, symptom);
    }
  }, [symptom]);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Find Medical Care for Your Symptoms
      </h2>

      <div className="mb-6">
        <input
          type="text"
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          placeholder="Enter symptom (e.g., fever, cough, headache)"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          Examples: fever, back pain, rash, chest pain, eye problem
        </p>
      </div>

      <button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
        disabled={loading}
      >
        {loading ? "Searching..." : "Find Medical Care"}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="mt-8">
        {filteredHospitals.length > 0 ? (
          <>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Recommended medical facilities for "{symptom}":
            </h3>

            {filteredHospitals.map((h, i) => (
              <div
                key={i}
                className="border p-4 rounded-md shadow mb-4 bg-white flex flex-col md:flex-row justify-between"
              >
                <div className="mb-3 md:mb-0">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {h.display_name.split(",")[0]}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{h.display_name}</p>
                  {h.extratags && h.extratags.phone && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Phone:</span>{" "}
                      {h.extratags.phone}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${h.lat}&mlon=${h.lon}#map=18/${h.lat}/${h.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4"
                      />
                    </svg>
                    View Map
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Get Directions
                  </a>
                </div>
              </div>
            ))}
          </>
        ) : hospitals.length > 0 ? (
          <p className="text-gray-700">
            Refining search results for "{symptom}"...
          </p>
        ) : loading ? (
          <div className="flex justify-center mt-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HospitalSuggestion;
