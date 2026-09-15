import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const [pickupName, setPickupName] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const navigate = useNavigate();
  const getPlaceNameFromCoordinates = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            lat: lat,
            lon: lon,
            format: "json",
          },
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      return response.data.display_name;
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
      return "Unknown Location";
    }
  };

  useEffect(() => {
    const fetchLocationNames = async () => {
      if (props.ride?.pickup?.ltd && props.ride?.pickup?.lng) {
        const pickup = await getPlaceNameFromCoordinates(
          props.ride.pickup.ltd,
          props.ride.pickup.lng
        );
        setPickupName(pickup);
      }
      if (props.ride?.destination?.ltd && props.ride?.destination?.lng) {
        const destination = await getPlaceNameFromCoordinates(
          props.ride.destination.ltd,
          props.ride.destination.lng
        );
        setDestinationName(destination);
      }
    };

    fetchLocationNames();
  }, [props.ride]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8003/api/v1/ride/start-ride",
        {
          rideId: props.ride?._id,
          otp: otp,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        props.setConfirmRidePopupPanel(false);
        props.setRidePopupPanel(false);

        navigate("/CaptainRiding", { state: { ride: props.ride } });
        alert("Ride started successfully!");
      }
    } catch (error) {
      alert("Invalid OTP or network error.");
    }
  };

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.setRidePopupPanel(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">
        Confirm this ride to Start
      </h3>
      <div className="flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3">
          <img
            className="h-12 rounded-full object-cover w-12"
            src={
              props.ride?.user?.profilePicture ||
              "https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            }
            alt=""
          />
          <h2 className="text-lg font-medium capitalize">
            {props.ride?.user?.fullname?.firstname +
              " " +
              props.ride?.user?.fullname?.lastname || "ram prasad yadav"}
          </h2>
        </div>
      </div>
      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {pickupName || "Loading..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Drop-off</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {destinationName || "Loading..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props?.ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full">
          <form onSubmit={handleSubmit}>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              className="bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full mt-3"
              placeholder="Enter OTP"
              required
            />
            <button
              type="submit"
              className="w-full mt-5 text-lg flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => {
                props.setConfirmRidePopupPanel(false);
                props.setRidePopupPanel(false);
              }}
              className="w-full mt-2 bg-red-600 text-lg text-white font-semibold p-3 rounded-lg"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
