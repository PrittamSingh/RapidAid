import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import socket from "../utils/socket";

const LookingForDriver = (props) => {
  const [ride, setRide] = useState(null);
  const [popUp, setPopUp] = useState(false);
  const navigate = useNavigate(); // Correct way to navigate

  // if (props.data) {
  //   props.setConfirmRidePanel(false);
  //   props.setLookingForDriverPanel(false);
  //   setRide(data);
  //   navigate("/UserRideShow");
  // }

  return (
    <div className="looking-for-driver">
      <div>
        <h5
          className="p-1 text-center w-[93%] absolute top-0"
          onClick={() => {
            props.setConfirmRidePanel(false);
            props.setLookingForDriverPanel(false);
          }}
        >
          <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
        </h5>
        <h3 className="text-2xl font-semibold mb-5">Looking For Driver</h3>

        <div className="flex gap-2 justify-between flex-col items-center">
          <img
            className="h-20"
            src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
            alt=""
          />
          <div className="w-full mt-5">
            <div className="flex items-center gap-5 p-3 border-b-2">
              <i className="ri-map-pin-user-fill"></i>
              {popUp && (
                <h3 className="text-lg font-medium">{ride?.user?.otp}</h3>
              )}
              <div>
                <h3 className="text-lg font-medium">562/11-A</h3>
                <p className="text-sm -mt-1 text-gray-600">pickup</p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-3 border-b-2">
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className="text-lg font-medium">562/11-A</h3>
                <p className="text-sm -mt-1 text-gray-600">555</p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-3">
              <i className="ri-currency-line"></i>
              <div>
                <h3 className="text-lg font-medium">
                  {/* ₹{props.fare[props.vehicleType]} */}
                </h3>
                <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LookingForDriver;
