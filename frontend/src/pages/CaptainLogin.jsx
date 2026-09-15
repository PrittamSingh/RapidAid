import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserTie } from "react-icons/fa";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { CaptainDataContext } from "../context/CaptainContext";
import socket from "../utils/socket";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setCaptain, setError, setIsLoading } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported.");
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            reject("Failed to get location.");
          }
        );
      }
    });
  };

  const submithandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const location = await getLocation();

      const response = await axios.post(
        "http://localhost:8003/api/v1/captain/login",
        { email, password }
      );

      if (response.status === 200) {
        const data = response.data;
        const captainData = data.captain || data;

        // Store captain data in localStorage
        localStorage.setItem("captain", JSON.stringify(captainData));
        localStorage.setItem("captain-token", data.token);

        // Update context with captain data
        setCaptain(captainData);

        // ✅ Emit location and join socket room
        socket.emit("update-location-captain", {
          userId: captainData._id,
          location,
        });

        socket.emit("join", {
          userId: captainData._id,
          userType: "captain",
        });

        navigate("/CaptainHome");
      }

      setEmail("");
      setPassword("");
    } catch (err) {
      alert("Invalid email or password");
      setError(err?.response?.data?.msg || err?.message || "Login failed.");
      console.error("Login Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8">
        <div className="flex items-center justify-center text-yellow-600 mb-6">
          <FaUserTie size={40} />
          <h2 className="ml-3 text-2xl font-bold">Captain Login</h2>
        </div>

        <form onSubmit={submithandler} className="space-y-6">
          <div>
            <label className="text-lg font-semibold flex items-center mb-2 text-gray-700">
              <AiOutlineMail className="mr-2 text-gray-500" /> Captain Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="your.email@fleet.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="text-lg font-semibold flex items-center mb-2 text-gray-700">
              <AiOutlineLock className="mr-2 text-gray-500" /> Enter Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition duration-300"
          >
            Login as Captain
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="font-bold text-gray-700">Join a fleet?</span>
          <Link
            className="text-yellow-600 font-medium hover:underline ml-2"
            to="/CaptainSignup"
          >
            Register as a Captain
          </Link>
        </div>

        <div className="flex justify-center items-center mt-10">
          <Link
            to="/UserLogin"
            className="bg-blue-600 px-12 py-3 rounded-lg text-white font-semibold text-lg shadow-md 
               hover:bg-blue-700 hover:shadow-lg transition duration-300"
          >
            Sign in as a User
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaptainLogin;
