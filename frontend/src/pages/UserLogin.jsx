import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import socket from "../utils/socket"; // ✅ Import shared socket
import NewHome from "../utils/NewHome";
const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submithandler = async (e) => {
    e.preventDefault();
    const user = { email, password };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/login`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      const loggedInUser = data.user;

      setUserData(loggedInUser);
      localStorage.setItem("token", data.token);
      localStorage.setItem("emailSOS", JSON.stringify(data.user.emailSOS));
      // ✅ Correct userId from nested user object
      socket.emit("join", {
        userId: loggedInUser._id,
        userType: "user",
      });

      navigate("/NewHome"); // Navigate to NewHome component
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Invalid credentials, please try again.");
      } else {
        console.error("Login error:", error);
        alert("Something went wrong. Please try again later.");
      }
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8">
        <div className="flex items-center justify-center text-blue-700 mb-6">
          <h2 className="text-2xl font-bold">User Login</h2>
        </div>

        <form onSubmit={submithandler} className="space-y-6">
          <div>
            <label className="text-lg font-semibold flex items-center mb-2">
              <AiOutlineMail className="mr-2 text-gray-500" /> Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="your@email.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="text-lg font-semibold flex items-center mb-2">
              <AiOutlineLock className="mr-2 text-gray-500" /> Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder="Enter password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition duration-300"
          >
            Login as User
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="font-bold">New User?</span>
          <Link
            className="text-blue-600 font-medium hover:underline ml-2"
            to="/UserSignup"
          >
            Create new Account
          </Link>
        </div>

        <div className="flex justify-center items-center mt-10">
          <Link
            to="/CaptainLogin"
            className="bg-green-500 px-12 py-3 rounded-lg text-white font-semibold text-lg shadow-md 
               hover:bg-green-600 hover:shadow-lg transition duration-300"
          >
            Login as Captain
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
