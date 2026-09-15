import React from "react";

const CurrentLocationFinder = ({
  setPannelOpen,
  setVehiclePanel,
  setPickup,
  pickup,
}) => {
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPickup({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-60px bg-gray-400 rounded-lg shadow-lg p-4 h-20px text-white text-lg active:bg-gray-500 hover:bg-gray-600 transition duration-300 ease-in-out">
      <button onClick={getLocation}>Get Current Location</button>
    </div>
  );
};

export default CurrentLocationFinder;
