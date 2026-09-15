// LocationContext.js
import React, { createContext, useState, useContext } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  const updatePickup = (value) => setPickup(value);
  const updateDestination = (value) => setDestination(value);

  return (
    <LocationContext.Provider
      value={{ pickup, destination, updatePickup, updateDestination }}
    >
      {children}
    </LocationContext.Provider>
  );
};
