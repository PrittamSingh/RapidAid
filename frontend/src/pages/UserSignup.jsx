import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { UserDataContext } from "../context/UserContext";

const UserSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSOS, setEmailSOS] = useState("");
  const { setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      emailSOS,
      password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/register`,
        newUser,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        const data = response.data;
        setUserData(data);

        navigate("/UserLogin");

        // Clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8">
        <div className="flex items-center justify-center text-blue-700 mb-6">
          <h2 className="text-2xl font-bold">User Signup</h2>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="text-lg font-semibold flex items-center mb-2">
              <AiOutlineUser className="mr-2 text-gray-500" /> First Name
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              type="text"
              placeholder="First Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="text-lg font-semibold flex items-center mb-2">
              <AiOutlineUser className="mr-2 text-gray-500" /> Last Name
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              type="text"
              placeholder="Last Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

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
          <div>
            <label className="text-lg font-semibold flex items-center mb-2">
              <AiOutlineMail className="mr-2 text-gray-500" /> Email for
              SOS(parent)
            </label>
            <input
              value={emailSOS}
              onChange={(e) => setEmailSOS(e.target.value)}
              required
              type="email"
              placeholder="your@email.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-yellow-300" : "bg-yellow-500 hover:bg-yellow-600"
            } text-white font-bold py-3 rounded-lg transition duration-300`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="font-bold">Already have an account?</span>
          <Link
            className="text-blue-600 font-medium hover:underline ml-2"
            to="/UserLogin"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
