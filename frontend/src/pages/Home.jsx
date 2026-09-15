import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import MyMap from "./MyMap";
import { LocationContext } from "../context/searchContext";
import WaitingForDriver from "../Components/WaitingForDriver";
import LookingForDriver from "../Components/LookingForDriver";
import ConfirmRidepanel from "../Components/ConfirmRide";
import "remixicon/fonts/remixicon.css";
import LocationSearchPannel from "../Components/LocationSearchPannel";
import VehiclePanel from "../Components/VehiclePanel";
import CurrentLocationFinder from "./CurrentLocationFinder";
import socket from "../utils/socket"; // Use only this socket import
import emailjs from "@emailjs/browser";

const Home = () => {
  const { userData } = useContext(UserDataContext);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pannelOpen, setPannelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [searchType, setSearchType] = useState("pickup");
  const pannelRef = useRef(null);
  const pannelCloseRef = useRef(null);
  const vehiclePannelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const LookingForDriverPanelRef = useRef(null);
  const [LookingForDriverPanel, setLookingForDriverPanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const WaitingForDriverRef = useRef(null);
  const [WaitingForDriverPanel, setWaitingForDriverPanel] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [pickupText, setPickupText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [data, setData] = useState(null);
  const [location, setLocation] = useState(null);
  const [emailSOS, setEmailSOS] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  useEffect(() => {
    if (userData && userData._id) {
      socket.emit("join", { userId: userData._id, userType: "user" });
    }
    console.log("Socket connected:", socketConnected);
  }, []);
  // Handle socket connection and event listeners
  useEffect(() => {
    if (!userData || !userData._id) {
      return;
    }

    socket.on("connect", () => {
      setSocketConnected(true);

      socket.emit("join", { userId: userData._id, userType: "user" });
    });

    socket.on("connect_error", (error) => {
      setSocketConnected(false);
    });

    socket.on("ride-confirmed", (rideData) => {
      if (rideData) {
        setData(rideData);
        setConfirmRidePanel(false);
        setWaitingForDriverPanel(true);
      }
    });

    if (socket && !socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("ride-confirmed");
    };
  }, [userData]);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const fetchLocationSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: query,
            format: "json",
            addressdetails: 1,
            limit: 5,
          },
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const handleSearchChange = (e, type) => {
    const query = e.target.value;
    setSearchType(type);

    if (type === "pickup") {
      setPickupText(query);
    } else {
      setDestinationText(query);
    }

    fetchLocationSuggestions(query);
  };

  const handleLocationSelect = (suggestion) => {
    const { lat, lon, display_name } = suggestion;

    if (searchType === "pickup") {
      setPickup({ lat, lon });
      setPickupText(display_name);
    } else {
      setDestination({ lat, lon });
      setDestinationText(display_name);
    }

    setSuggestions([]);

    if (
      searchType === "destination" ||
      (searchType === "pickup" && destination)
    ) {
      const closePanelPromise = new Promise((resolve) => {
        setPannelOpen(false);
        setTimeout(resolve, 300);
      });

      closePanelPromise.then(() => {
        setVehiclePanel(true);
      });
    }
  };

  const sendSOSMail = (targetEmail) => {
    if (!targetEmail) {
      alert("Please enter an email address for SOS");
      return;
    }

    if (!location) {
      alert("Location not available for SOS");
      return;
    }

    emailjs
      .send(
        "service_zop4su7",
        "template_dgaf6ul",
        {
          to_email: targetEmail,
          user_name: userData?.name || "User",
          message: `I need help! My current location is: https://www.google.com/maps?q=${location.lat},${location.lng}`,
        },
        "fL2jnaLhbmNruad_j"
      )
      .then((res) => {
        alert("SOS email sent to " + targetEmail);
      })
      .catch((err) => {
        // alert("Failed to send SOS email.");
        console.error("FULL EMAILJS ERROR:", err);
    console.error("Status:", err.status);
    console.error("Message:", err.text);

    alert(`EmailJS Error: ${err.text}`);
      });
  };

  useGSAP(() => {
    if (pannelOpen) {
      gsap.to(pannelRef.current, {
        height: "70%",
        padding: 24,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(pannelRef.current, {
        height: "0%",
        padding: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setSuggestions([]);
        },
      });
    }
  }, [pannelOpen]);

  useGSAP(() => {
    gsap.to(vehiclePannelRef.current, {
      translateY: vehiclePanel ? 0 : "100%",
      duration: 0.3,
      ease: "power2.out",
    });
  }, [vehiclePanel]);

  useGSAP(() => {
    gsap.to(confirmRidePanelRef.current, {
      translateY: confirmRidePanel ? 0 : "100%",
      duration: 0.3,
      ease: "power2.out",
    });
  }, [confirmRidePanel]);

  useGSAP(() => {
    gsap.to(LookingForDriverPanelRef.current, {
      translateY: LookingForDriverPanel ? 0 : "100%",
      duration: 0.3,
      ease: "power2.out",
    });
  }, [LookingForDriverPanel]);

  useGSAP(() => {
    gsap.to(WaitingForDriverRef.current, {
      translateY: WaitingForDriverPanel ? 0 : "100%",
      duration: 0.3,
      ease: "power2.out",
    });
  }, [WaitingForDriverPanel]);

  return (
    <div className="h-screen relative overflow-hidden">
      <div className="absolute right-2 top-1 z-10 flex gap-2">
        <input
          type="email"
          value={emailSOS}
          onChange={(e) => setEmailSOS(e.target.value)}
          placeholder="Emergency email"
          className="px-2 py-1 text-sm rounded-lg border"
        />
        <button
          onClick={() => sendSOSMail(emailSOS)}
          className="bg-red-600 text-white px-4 py-1 rounded-full font-semibold text-sm shadow-lg w-24"
        >
          SOS
        </button>
      </div>

      <div className="h-screen w-screen absolute top-4">
        <MyMap
          pickup={pickup}
          destination={destination}
          setLocation={setLocation}
        />
      </div>

      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
        {!vehiclePanel && (
          <div className="h-[30%] p-6 bg-white relative z-20">
            <h5
              ref={pannelCloseRef}
              onClick={() => setPannelOpen(false)}
              className="absolute right-6 top-6 text-2xl cursor-pointer"
            >
              <i className="ri-arrow-down-double-line"></i>
            </h5>
            <h4 className="text-3xl font-semibold mb-3">Find a Trip</h4>
            <form onSubmit={submitHandler}>
              <div className="line absolute h-16 w-1 top-[45%] -translate-y-1/2 left-8 bg-gray-700 rounded-full"></div>
              <input
                onClick={() => {
                  setPannelOpen(true);
                  setSearchType("pickup");
                }}
                onChange={(e) => handleSearchChange(e, "pickup")}
                value={pickupText || pickup}
                className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mb-3"
                type="text"
                placeholder="Add a pickup location"
              />
              <input
                onClick={() => {
                  setPannelOpen(true);
                  setSearchType("destination");
                }}
                onChange={(e) => handleSearchChange(e, "destination")}
                value={destinationText}
                className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full"
                type="text"
                placeholder="Enter Your Destination"
              />
            </form>
            <div ref={pannelRef} className="gap-8 mt-12">
              <CurrentLocationFinder
                pickup={pickup}
                setPickup={setPickup}
                setVehiclePanel={setVehiclePanel}
                setPannelOpen={setPannelOpen}
              />
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleLocationSelect(suggestion)}
                  className="flex gap-4 items-center justify-start border border-gray-200 bg-white px-4 py-3 rounded-xl shadow hover:shadow-md transition-shadow cursor-pointer hover:border-black mb-2"
                >
                  <div className="bg-[#f3f4f6] h-10 w-10 flex items-center justify-center rounded-full">
                    <i className="ri-map-pin-fill text-lg text-black"></i>
                  </div>
                  <div className="text-gray-800 font-medium text-base">
                    {suggestion.display_name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div
          ref={pannelRef}
          className="overflow-hidden bg-white z-10"
          style={{ height: "0%", padding: 0 }}
        >
          <div ref={pannelCloseRef} className="opacity-0 text-white text-xl">
            This is the sliding panel content.
          </div>
        </div>
      </div>

      <div
        ref={vehiclePannelRef}
        className="fixed bottom-0 left-0 w-full z-10 p-4 bg-white rounded-t-2xl shadow-2xl translate-y-full"
      >
        <VehiclePanel
          setVehiclePanel={setVehiclePanel}
          setConfirmRidePanel={setConfirmRidePanel}
          pickup={pickup}
          destination={destination}
        />
      </div>

      <div
        ref={confirmRidePanelRef}
        className="fixed bottom-0 left-0 w-full z-10 p-4 bg-white rounded-t-2xl shadow-2xl translate-y-full"
      >
        <ConfirmRidepanel
          data={data}
          setConfirmRidePanel={setConfirmRidePanel}
          setLookingForDriverPanel={setLookingForDriverPanel}
          pickup={pickup}
          destination={destination}
        />
      </div>

      <div
        ref={LookingForDriverPanelRef}
        className="fixed bottom-0 left-0 w-full z-10 p-8 bg-white rounded-t-2xl shadow-2xl translate-y-full"
      >
        <LookingForDriver
          data={data}
          setConfirmRidePanel={setConfirmRidePanel}
          setLookingForDriverPanel={setLookingForDriverPanel}
          setWaitingForDriverPanel={setWaitingForDriverPanel}
        />
      </div>

      <div
        ref={WaitingForDriverRef}
        className="fixed bottom-0 left-0 w-full z-10 p-8 bg-white rounded-t-2xl shadow-2xl translate-y-full"
      >
        <WaitingForDriver
          data={data}
          setConfirmRidePanel={setConfirmRidePanel}
          setLookingForDriverPanel={setLookingForDriverPanel}
          setWaitingForDriverPanel={setWaitingForDriverPanel}
        />
      </div>
    </div>
  );
};

export default Home;
