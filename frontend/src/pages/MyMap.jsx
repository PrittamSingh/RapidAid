import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const defaultPosition = [51.505, -0.09];

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MyMap = (props) => {
  const [position, setPosition] = useState(defaultPosition);
  const [userId, setUserId] = useState("me");
  const socketRef = useRef(null);
  const markersRef = useRef({});
  const mapRef = useRef(null);
  const myMarkerRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:8003");

    // Get socket ID when connected
    socketRef.current.on("connect", () => {
      console.log("Connected with ID:", socketRef.current.id);
      setUserId(socketRef.current.id);
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          setPosition([lat, lon]);
          props.setLocationData({
            ltd: position.coords.latitude,
            lng: position.coords.longitude,
          });
          if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit("send-location", {
              lat,
              lon,
              id: socketRef.current.id,
            });
          }
        },
        (error) => {
          console.error("Error getting initial location:", error.message);
          alert("Unable to get your location. Error: " + error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }

    const locationInterval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            setPosition([lat, lon]);
            const location = {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            };
            props.setLocation(location);

            if (socketRef.current && socketRef.current.connected) {
              socketRef.current.emit("send-location", {
                lat,
                lon,
                id: socketRef.current.id,
              });
            }
          },
          (error) => {
            console.error("Error getting updated location:", error.message);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
          }
        );
      }
    }, 5000);

    return () => {
      clearInterval(locationInterval);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("location", (location) => {
      if (!mapRef.current) return;

      const { lat, lon, id } = location;

      if (!id) {
        return;
      }

      // Don't add another marker for our own location
      if (id === socketRef.current.id) {
        return;
      }

      if (markersRef.current[id]) {
        markersRef.current[id].setLatLng([lat, lon]);
      } else {
        markersRef.current[id] = L.marker([lat, lon])
          .addTo(mapRef.current)
          .bindPopup("User: " + id.substring(0, 6))
          .openPopup();
      }
    });

    socketRef.current.on("user-disconnected", (userId) => {
      if (mapRef.current && markersRef.current[userId]) {
        mapRef.current.removeLayer(markersRef.current[userId]);
        delete markersRef.current[userId];
      }
    });
  }, []);

  function MapAccess() {
    const map = useMap();
    mapRef.current = map;

    useEffect(() => {
      // Only update when we have a real position (not default)
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
    }, [position, map, userId]);

    return null;
  }

  return (
    <div>
      <h3>Your User ID: {userId.substring(0, 6)}...</h3>
      <MapContainer
        center={position}
        zoom={13}
        style={{ zIndex: "1", height: "724px", width: "100%" }}
      >
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
  );
};

export default MyMap;
