import React, { useEffect, useState } from "react";
import axios from "axios";

const RidePopUp = ({
  ride,
  setRidePopupPanel,
  setConfirmRidePopupPanel,
  confirmRide,
}) => {
  const [pickupName, setPickupName] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [otp, setOtp] = useState("");
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
      if (ride?.pickup?.ltd && ride?.pickup?.lng) {
        const pickup = await getPlaceNameFromCoordinates(
          ride.pickup.ltd,
          ride.pickup.lng
        );

        setPickupName(pickup);
      }
      if (ride?.destination?.ltd && ride?.destination?.lng) {
        const destination = await getPlaceNameFromCoordinates(
          ride.destination.ltd,
          ride.destination.lng
        );
        setDestinationName(destination);
      }
    };

    fetchLocationNames();
  }, [ride]);

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => setRidePopupPanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5 text-center">
        New Ride Available!
      </h3>

      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={
              ride?.user?.profilePicture ||
              "https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            }
            alt="User"
          />
          <h2 className="text-lg font-medium">
            {ride?.user?.fullname?.firstname +
              " " +
              ride?.user?.fullname?.lastname}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">
          {Math.round(ride?.distance)} KM
        </h5>
      </div>

      <div className="flex flex-col items-center gap-2 justify-between">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup Location</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {pickupName || "Loading..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Drop-off Location</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {destinationName || "Loading..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>

        <div className="mt-5 w-full">
          <button
            onClick={() => {
              confirmRide();
              setRidePopupPanel(false);
              setConfirmRidePopupPanel(true);
            }}
            className="bg-green-600 w-full text-white font-semibold p-2 px-10 rounded-lg"
          >
            Accept
          </button>

          <button
            onClick={() => setRidePopupPanel(false)}
            className="mt-2 w-full bg-gray-300 text-gray-700 font-semibold p-2 px-10 rounded-lg"
          >
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;
