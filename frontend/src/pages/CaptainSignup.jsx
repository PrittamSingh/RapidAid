import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";

const CaptainSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  // Destructure the context correctly
  const { captain, setCaptain, isLoading, setIsLoading, setError } =
    useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    // Preparing captain's data
    const newCaptain = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType,
      },
    };

    // Set loading state
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/captain/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCaptain),
        }
      );

      // You would use axios or any other method to send the data to the backend here
      // For now, we're simulating the API call response
      // Mock response

      if (response.status === 201 || response.status === 200) {
        setCaptain(response.data); // Update captain data in context
        navigate("/CaptainLogin"); // Redirect to captain login page

        // Clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setVehicleColor("");
        setVehiclePlate("");
        setVehicleCapacity("");
        setVehicleType("");
      }
    } catch (error) {
      setError("Signup failed, please try again."); // Handle error
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading to false after API call
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8">
        <div className="flex items-center justify-center text-blue-700 mb-6">
          <h2 className="text-2xl font-bold">Captain Signup</h2>
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

          <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
          <div className="flex gap-4 mb-7">
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="Vehicle Color"
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
            />
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="Vehicle Plate"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
            />
          </div>
          <div className="flex gap-4 mb-7">
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="number"
              placeholder="Vehicle Capacity"
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
            />
            <select
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="" disabled>
                Select Vehicle Type
              </option>
              <option value="car">Ambulance</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="auto">Car</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading ? "bg-yellow-300" : "bg-yellow-500 hover:bg-yellow-600"
            } text-white font-bold py-3 rounded-lg transition duration-300`}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="font-bold">Already have an account?</span>
          <Link
            className="text-blue-600 font-medium hover:underline ml-2"
            to="/CaptainLogin"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaptainSignup;
