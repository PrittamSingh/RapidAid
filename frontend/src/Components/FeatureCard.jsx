import React, { useEffect } from "react";
import { useState } from "react";
import emailjs from "@emailjs/browser";
const FeatureCard = ({
  title,
  description,
  icon: Icon,
  href,
  isButton = false,
  buttonColor = "bg-blue-600 hover:bg-blue-700",
}) => {
  const [location, setLocation] = useState(null);
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
  const [data, setData] = useState(null);
  useEffect(() => {
    const eSOS = localStorage.getItem("emailSOS");

    const cleanedEmail = eSOS?.trim().replace(/^"+|"+$/g, "");

    if (!cleanedEmail || !cleanedEmail.includes("@")) {
      console.error("Invalid email format:", cleanedEmail);
      return;
    }

    setData(cleanedEmail);
  }, []);

  const sendSOSMail = (targetEmail) => {
    alert("Sending SOS email to " + targetEmail);
    emailjs
      .send(
        "service_u0fuo0a",
        "template_o54964f",
        {
          to_email: targetEmail,
          user_name: "Avinash",
          message: `I need help! My current location is: https://www.google.com/maps?q=${location.lat},${location.lng}
    `,
        },
        "mOGY5wniEyc0itVpW"
      )
      .then((res) => {
        alert("SOS email sent to " + targetEmail);
      })
      .catch((err) => {
        console.error("Failed to send email", err);
        alert("Failed to send SOS email.");
      });
  };
  return (
    <div className="h-full bg-white rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg overflow-hidden">
      <div className="p-6">
        <div
          className={`w-12 h-12 rounded-md flex items-center justify-center ${
            isButton ? buttonColor : "bg-blue-100"
          }`}
        >
          <Icon
            className={`h-6 w-6 ${isButton ? "text-white" : "text-blue-600"}`}
          />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-base text-gray-600">{description}</p>
        <div className="mt-4">
          {isButton ? (
            <button
              onClick={() => sendSOSMail(data)}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
            >
              {title}
            </button>
          ) : (
            <a
              href={href}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Continue
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
