import React from "react";
import { useNavigate } from "react-router-dom";

const WaitingForDriver = (props) => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/UserRideShow");
  };
  return (
    <div>
      <div className="bg-blue-400 w-40 rounded">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Live Track
        </button>
      </div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.setWaitingForDriverPanel(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <div className="flex items-center justify-between">
        <img
          className="h-12"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt=""
        />
        <div className="text-right">
          <h2 className="text-lg font-medium capitalize">
            {props?.data?.captain?.fullname?.firstname +
              " " +
              props?.data?.captain?.fullname?.lastname}
          </h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1">
            {props?.data?.captain?.vehicle?.plate}
          </h4>
          <p className="text-lg text-gray-800">
            {props?.data?.captain?.vehicle?.vehicleType}
          </p>
          <h1 className="text-lg font-semibold"> Captain </h1>
        </div>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.pickup}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props?.data?.fare} </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 p-3 bg-gray-100 rounded shadow-md">
        <h3 className="text-lg font-medium text-center">Your OTP</h3>
        <p className="text-2xl font-bold text-center text-blue-600">
          {props?.data?.otp}
        </p>
      </div>
    </div>
  );
};

export default WaitingForDriver;
