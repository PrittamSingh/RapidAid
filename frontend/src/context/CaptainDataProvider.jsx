import React, { createContext, useContext, useState, useEffect } from "react";

export const CaptainDataContext = createContext();

export const useCaptainData = () => useContext(CaptainDataContext);

export const CaptainDataProvider = ({ children }) => {
  const [captain, setCaptain] = useState(null);

  // On initial load, check if captain data is in localStorage
  useEffect(() => {
    const storedCaptain = localStorage.getItem("captain");
    if (storedCaptain) {
      setCaptain(JSON.parse(storedCaptain)); // Restore captain data from localStorage
    }
  }, []);

  return (
    <CaptainDataContext.Provider value={{ captain, setCaptain }}>
      {children}
    </CaptainDataContext.Provider>
  );
};
