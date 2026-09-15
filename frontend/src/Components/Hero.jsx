import React from "react";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import FeaturePopup from "./FeaturePopup";
const Hero = (props) => {
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
          message: `I need help! My current location is: https://www.google.com/maps?q=${props.location.lat},${props.location.lng}
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
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
      <div>
        <FeaturePopup></FeaturePopup>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 py-8 sm:py-16 md:py-20 lg:py-28 lg:max-w-2xl lg:w-full">
          <div className="mt-10 sm:mt-12">
            <div className="sm:max-w-xl">
              <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl md:text-6xl">
                Your Health, Our Priority
              </h1>
              <p className="mt-6 text-xl text-blue-100">
                RapidAid provides comprehensive healthcare solutions at your
                fingertips. Access medical assistance, find hospitals, book
                ambulances, and more.
              </p>
            </div>
            <div className="mt-10 sm:flex sm:justify-start">
              <div className="rounded-md shadow">
                <a
                  href="#features"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                >
                  Explore Services
                </a>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <button
                  onClick={() => sendSOSMail(data)}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  SOS Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg"
          alt="Doctor with stethoscope"
        />
      </div>
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-blue-900 via-blue-800 opacity-30 lg:hidden"></div>
    </div>
  );
};

export default Hero;
