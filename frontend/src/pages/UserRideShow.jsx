import React, { useEffect, useState, useRef, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import socket from "../utils/socket";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { CaptainDataContext } from "../context/CaptainContext";
const defaultPosition = [51.505, -0.09];

// Set default marker icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const UserRideShow = () => {
  const [position, setPosition] = useState(defaultPosition);
  const [userId, setUserId] = useState("me");
  const mapRef = useRef(null);
  const myMarkerRef = useRef(null);
  const markersRef = useRef({});
  const navigate = useNavigate();

  // Get current location and send to server
  useEffect(() => {
    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const lat = coords.latitude;
          const lon = coords.longitude;
          setPosition([lat, lon]);

          socket.emit("send-location", { lat, lon, id: socket.id });
        },
        (err) => alert("Location Error: " + err.message),
        { enableHighAccuracy: true }
      );
    };

    updateLocation();
    const interval = setInterval(updateLocation, 5000);

    return () => clearInterval(interval);
  }, []);

  // On socket connect
  useEffect(() => {
    socket.on("connect", () => {
      setUserId(socket.id);
    });

    socket.on("location", ({ lat, lon, id }) => {
      if (id === socket.id || !mapRef.current) return;

      if (markersRef.current[id]) {
        markersRef.current[id].setLatLng([lat, lon]);
      } else {
        markersRef.current[id] = L.marker([lat, lon])
          .addTo(mapRef.current)
          .bindPopup("User: " + id.substring(0, 6))
          .openPopup();
      }
    });

    socket.on("user-disconnected", (id) => {
      if (markersRef.current[id]) {
        mapRef.current.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });

    return () => {
      socket.off("connect");
      socket.off("location");
      socket.off("user-disconnected");
    };
  }, []);

  const MapAccess = () => {
    const map = useMap();
    mapRef.current = map;

    useEffect(() => {
      if (
        position[0] !== defaultPosition[0] ||
        position[1] !== defaultPosition[1]
      ) {
        map.setView(position, 13);

        if (!myMarkerRef.current) {
          myMarkerRef.current = L.marker(position)
            .addTo(map)
            .bindPopup("Me (" + userId.substring(0, 6) + ")")
            .openPopup();
        } else {
          myMarkerRef.current.setLatLng(position);
          myMarkerRef.current
            .getPopup()
            .setContent("Me (" + userId.substring(0, 6) + ")");
        }
      }
    }, [position, map]);

    return null;
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        <MapContainer center={position} zoom={13} style={{ height: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <MapAccess />
          <Marker position={position}>
            <Popup>My current location</Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="bg-white shadow-md p-4 flex flex-col items-center">
        <h3 className="text-2xl font-semibold mb-4">Live Ride</h3>
        <img
          className="h-20 rounded-md mb-4"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt="car"
        />
        <button
          onClick={() => navigate("/home")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all duration-300"
        >
          Confirm & Go Home
        </button>
      </div>
    </div>
  );
};

export default UserRideShow;
