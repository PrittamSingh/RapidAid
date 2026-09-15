// src/context/UserContext.js

import React, { createContext, useState } from "react";

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    fullname: { firstname: "", lastname: "" },
  });
  const [user, setUser] = useState(null);

  return (
    <UserDataContext.Provider value={{ userData, setUserData, user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
