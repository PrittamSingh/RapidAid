// LocationSearch.jsx
import React, { useState } from "react";
import axios from "axios";
import { useSearch } from "..context/SearchContext"; // Import the context

const LocationSearch = ({ onSelectLocation }) => {
  const { searchQuery, updateSearchQuery } = useSearch(); // Get searchQuery from context
  const [suggestions, setSuggestions] = useState([]);

  const fetchLocationSuggestions = async (query) => {
    if (query.length < 3) return; // Avoid sending request if query is too short

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: query,
            format: "json",
            addressdetails: 1,
            limit: 5,
          },
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    updateSearchQuery(query); // Update the search query in context
    fetchLocationSuggestions(query);
  };

  const handleLocationSelect = (lat, lon) => {
    onSelectLocation(lat, lon);
    setSuggestions([]);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for a location"
        className="w-full p-3 mb-4 border border-gray-300 rounded-xl shadow-md"
      />
      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() =>
                handleLocationSelect(suggestion.lat, suggestion.lon)
              }
              className="flex gap-4 items-center justify-start border border-gray-200 bg-white px-4 py-3 rounded-xl shadow hover:shadow-md transition-shadow cursor-pointer hover:border-black"
            >
              <div className="bg-[#f3f4f6] h-10 w-10 flex items-center justify-center rounded-full">
                <i className="ri-map-pin-fill text-lg text-black"></i>
              </div>
              <div className="text-gray-800 font-medium text-base">
                {suggestion.display_name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
