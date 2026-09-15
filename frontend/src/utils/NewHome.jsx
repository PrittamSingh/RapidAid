import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
// import Testimonials from "../components/Testimonials";
import { Link } from "react-router-dom";
import PhotoScroller from "../components/PhotoScroller";
import Footer from "../components/Footer";

function NewHome() {
  const navLinks = [
    { label: "Home", href: "#" },
    { label: "Services", href: "#features" },
    { label: "About", href: "#about" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Mobile App", href: "#app" },
    { label: "Contact", href: "#contact" },
  ];

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError("Permission denied or error getting location.");
        }
      );
    } else {
      setError("Geolocation not supported.");
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar links={navLinks} />
      <main className="flex-grow">
        <Hero location={location} />
        <Features location={location} />
        {/* <Testimonials /> */}
        <PhotoScroller />

        {/* Live Location Display */}
        <div className="p-4 text-center text-sm text-gray-700">
          {location ? (
            <p>
              📍 Your Location: Latitude: {location.lat.toFixed(4)}, Longitude:{" "}
              {location.lng.toFixed(4)}
            </p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p>Fetching your location...</p>
          )}
        </div>
      </main>
      <Footer />

      {/* Floating SOS Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link to="/aiChatBot">
          <button
            className="flex items-center justify-center p-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform transition-transform duration-300 hover:scale-110"
            aria-label="Emergency SOS"
          >
            <span className="font-bold">ChatBot</span>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default NewHome;
