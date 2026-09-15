import React from "react";
import axios from "axios";
import { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext"; // adjust path as needed

const VehiclePanel = ({
  pickup,
  destination,
  setVehiclePanel,
  setConfirmRidePanel,
}) => {
  const { setRide } = useContext(CaptainDataContext);

  const handleRideCreation = async (vehicleType) => {
    if (
      !pickup?.lat ||
      !pickup?.lon ||
      !destination?.lat ||
      !destination?.lon
    ) {
      alert("Pickup or destination coordinates are missing or invalid.");
      return;
    }

    const payload = {
      pickup: {
        ltd: pickup.lat,
        lng: pickup.lon,
      },
      destination: {
        ltd: destination.lat,
        lng: destination.lon,
      },
      vehicleType,
    };

    try {
      const response = await axios.post(
        "https://rapidaid-backend-hsn5.onrender.com/api/v1/ride/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRide(response.data.ride); // store ride in global context
      setConfirmRidePanel(true);
    } catch (error) {
      console.error("Failed to create ride:", error.response?.data || error);
      alert("Failed to create ride. Please try again.");
    }
  };

  return (
    <div>
      <h5
        onClick={() => setVehiclePanel(false)}
        className="p-3 absolute left-40 top-0 justify-content-centre"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>
      <h2 className="mb-3 text-bold">Choose a Vehicle</h2>

      {/* Car */}
      <div
        onClick={() => handleRideCreation("car")}
        className="flex items-center justify-between bg-white p-2 rounded-lg shadow-md w-full mb-2 border-2 border-gray-200 active:border-black"
      >
        <img
          className="h-10 w-12 object-contain"
          src="https://img.favpng.com/3/7/15/ambulance-portable-network-graphics-vector-graphics-clip-art-computer-icons-png-favpng-ti21rTQdMxswcxxyybisShLrY.jpg"
          alt="Car"
        />
        <div className="flex flex-col gap-0 mx-2">
          <h4 className="font-semibold text-lg">
            Ambulance Service{" "}
            <span className="ml-2 text-gray-600">
              <i className="ri-user-line"></i> 4
            </span>
          </h4>
          <h5 className="text-sm text-gray-600">2 mins away</h5>
          <p className="text-sm text-gray-600">Affordable, compact rides</p>
        </div>
        <h2 className="text-xl font-bold text-gray-800">₹22.20/KM</h2>
      </div>

      {/* Bike */}
      <div
        onClick={() => handleRideCreation("bike")}
        className="flex items-center justify-between bg-white p-2 rounded-lg shadow-md w-full mb-2 border-2 border-gray-200 active:border-black"
      >
        <img
          className="h-10 w-12 object-contain"
          src="https://e7.pngegg.com/pngimages/316/151/png-clipart-motorcycle-motorcycle-thumbnail.png"
          alt="Bike"
        />
        <div className="flex flex-col gap-0 mx-2">
          <h4 className="font-semibold text-lg">
            Bike{" "}
            <span className="ml-2 text-gray-600">
              <i className="ri-user-line"></i> 1
            </span>
          </h4>
          <h5 className="text-sm text-gray-600">3 mins away</h5>
          <p className="text-sm text-gray-600">Quick and economical</p>
        </div>
        <h2 className="text-xl font-bold text-gray-800">₹10.50/KM</h2>
      </div>

      {/* Rickshaw */}
      <div
        onClick={() => handleRideCreation("auto")}
        className="flex items-center justify-between bg-white p-2 rounded-lg shadow-md w-full mb-2 border-2 border-gray-200 active:border-black"
      >
        <img
          className="h-10 w-16 object-contain"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt="Rickshaw"
        />
        <div className="flex flex-col gap-0 mx-2">
          <h4 className="font-semibold text-lg">
            Private Car{" "}
            <span className="ml-2 text-gray-600">
              <i className="ri-user-line"></i> 3
            </span>
          </h4>
          <h5 className="text-sm text-gray-600">5 mins away</h5>
          <p className="text-sm text-gray-600">Best for short city rides</p>
        </div>
        <h2 className="text-xl font-bold text-gray-800">₹30.00/KM</h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
