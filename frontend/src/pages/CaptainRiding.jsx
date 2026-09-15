import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import MyMap from "./MyMap";
import socket from "../utils/socket"; // ✅ Import socket

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
  const [captain, setCaptain] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const locationIntervalRef = useRef(null);

  useEffect(() => {
    const cpt = localStorage.getItem("captain");
    if (cpt) setCaptain(JSON.parse(cpt));
  }, []);

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

    sendLocation(); // Initial emit
    locationIntervalRef.current = setInterval(sendLocation, 5000);

    return () => {
      clearInterval(locationIntervalRef.current);
    };
  }, [captain, isConnected]);

  useGSAP(() => {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [finishRidePanel]);

  return (
    <div className="h-screen relative flex flex-col justify-end">
      <div className="h-750 absolute top-0 w-full">
        <MyMap />
      </div>
      <div
        className="h-0.5/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10"
        onClick={() => {
          setFinishRidePanel(true);
        }}
      >
        <h5 className="p-1 text-center w-[90%] absolute top-0">
          <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
        </h5>
        <h4 className="text-xl font-semibold">Happy journey</h4>
        <button className=" bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
          Complete Ride
        </button>
      </div>
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <FinishRide setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
