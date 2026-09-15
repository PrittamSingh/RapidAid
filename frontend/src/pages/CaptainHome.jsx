import React, { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import axios from "axios";
import RidePopUp from "../Components/RidePopUp";
import ConfirmRidePopUp from "../Components/ConfirmRidePopUp";
import CaptainDetails from "../Components/CaptainDetails";
import MyMap from "./MyMap";
import socket from "../utils/socket";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainHome = () => {
  const [locationData, setLocationData] = useState(null);
  const [ride, setRide] = useState(null);
  const [ridePopUpData, setRidePopUpData] = useState(null);
  const [confirmRideData, setConfirmRideData] = useState(null);
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [locationUpdating, setLocationUpdating] = useState(false);

  const ridePopupRef = useRef(null);
  const confirmRidePopupRef = useRef(null);
  const locationIntervalRef = useRef(null);
  const { captain } = useContext(CaptainDataContext);

  // Handle socket connection
  useEffect(() => {
    if (!socket) return;

    if (!socket.connected) socket.connect();

    const onConnect = () => {
      setIsConnected(true);
      if (captain?._id) {
        socket.emit("join", { userId: captain._id, userType: "captain" });
      }
    };

    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // In case already connected
    if (socket.connected && captain?._id) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [captain]);

  // Send live location every 5s
  useEffect(() => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }

    if (!captain?._id || !isConnected) return;

    setLocationUpdating(true);

    const sendLocation = () => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: coords.latitude,
              lng: coords.longitude,
            },
          });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    };

    sendLocation();
    locationIntervalRef.current = setInterval(sendLocation, 5000);

    return () => {
      clearInterval(locationIntervalRef.current);
      setLocationUpdating(false);
    };
  }, [captain, isConnected]);

  // Listen for new ride
  useEffect(() => {
    if (!isConnected) return;

    const onNewRide = (rideData) => {
      setRide(rideData);
      setRidePopUpData(rideData);
      setRidePopupPanel(true);
    };

    socket.on("new-ride", onNewRide);

    return () => socket.off("new-ride", onNewRide);
  }, [isConnected]);

  // Confirm ride handler
  const confirmRide = async () => {
    if (!ride || !captain) return;

    try {
      const token = localStorage.getItem("captain-token");
      const res = await axios.post(
        "https://rapidaid-backend-hsn5.onrender.com/api/v1/ride/confirm",
        {
          rideId: ride._id,
          captainId: captain._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setConfirmRideData(res.data);

      setConfirmRidePopupPanel(true);
      setRidePopupPanel(false);
    } catch (err) {
      console.error("Failed to confirm ride:", err);
    }
  };

  // GSAP animations
  useGSAP(() => {
    gsap.to(ridePopupRef.current, {
      transform: ridePopupPanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [ridePopupPanel]);

  useGSAP(() => {
    gsap.to(confirmRidePopupRef.current, {
      transform: confirmRidePopupPanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [confirmRidePopupPanel]);

  return (
    <div className="h-screen w-screen ">
      {/* Top Bar */}
      <div className="fixed top-0 p-2 w-full flex justify-between items-center">
        <div className="flex items-center gap-4 z-10 ">
          {locationUpdating && (
            <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">
              Location active
            </span>
          )}
          <Link
            to="/CaptainLogout"
            className="absolute -top-2 right-2 m-4 h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center"
          >
            <img
              src="https://toppng.com/uploads/preview/logout-11551056293ans77of4wy.png"
              alt="error"
            />
          </Link>
        </div>
      </div>

      {/* Map + Captain Info */}
      <div className="h-400 relative top-6">
        <MyMap setLocationData={setLocationData} />
      </div>
      <div className="h-1/5 p-6 z-10">
        <CaptainDetails />
      </div>

      {/* Confirm Ride Popup */}
      <div
        ref={confirmRidePopupRef}
        className="fixed w-full h-screen bottom-0 z-10 bg-white px-3 py-10 pt-12 translate-y-full"
      >
        <ConfirmRidePopUp
          ride={ride}
          confirmRide={confirmRide}
          confirmRideData={confirmRideData}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
        />
      </div>

      {/* Ride Request Popup */}
      <div
        ref={ridePopupRef}
        className="fixed w-full bottom-0 z-10 bg-white px-3 py-10 pt-12 translate-y-full"
      >
        <RidePopUp
          ride={ride}
          confirmRide={confirmRide}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
