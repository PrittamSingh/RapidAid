import React from "react";
import UserLogin from "./UserLogin";
import { Link } from "react-router-dom";
const Start = () => {
  return (
    <div className="h-screen w-full relative bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center justify-start p-6">
      {/* Top Bar */}

      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-red-600">🚑 RapidAid</h1>
        <button className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
          SOS
        </button>
      </div>

      {/* Main Heading */}
      <div className="text-center mt-10">
        <h2 className="text-3xl font-bold text-blue-900 mb-2">
          Get Help Fast —<br /> Instant Emergency Ride & AI Health Support
        </h2>
        <p className="mx-20 text-blue-800 max-w-md mt-2">
          Book a ride, get AI-based health tips, and access emergency support —
          all in one place.
        </p>
      </div>

      {/* Continue Button */}

      <Link to="/UserLogin">
        <button className="mt-20 bg-white text-blue-900 font-semibold px-10 py-3 rounded-full shadow-md hover:bg-blue-100 transition active:bg-blue-600">
          Continue
        </button>
      </Link>

      {/* Features Section */}
      <div className="mt-64 w-screen bg-white rounded-3xl shadow-lg p-16 w-full max-w-lg absolute bottom-0 left-0 right-0 mx-auto">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-red-500 text-3xl">🚑</span>
          <p className="font-medium text-blue-900">Emergency Ride in Seconds</p>
        </div>
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-blue-500 text-3xl">🧬</span>
          <p className="font-medium text-blue-900">AI Medical Suggestions</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-red-400 text-3xl">📍</span>
          <p className="font-medium text-blue-900">
            Nearest Hospitals & Pharmacies
          </p>
        </div>
      </div>
    </div>
  );
};

export default Start;
