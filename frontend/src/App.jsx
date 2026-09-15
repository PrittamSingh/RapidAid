import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
// import Start from "./pages/Start";
// import UserLogin from "./pages/UserLogin";
// import UserSignup from "./pages/UserSignup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import Home from "./pages/Home";
import Riding from "./pages/Riding";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import UserLogout from "./pages/UserLogout";
import CaptainHome from "./pages/CaptainHome";
import "leaflet/dist/leaflet.css";
import HospitalSuggestion from "./Components/HospitalSuggestion";
import UserRideShow from "./pages/UserRideShow";
// import UserProtectWrapper from "./pages/UserProtectWrapper";
// import UserLogout from "./pages/UserLogout";
// import CaptainHome from "./pages/CaptainHome";
// import CaptainProtectWrapper from "./pages/CaptainProtectWrapper";
// import CaptainLogout from "./pages/CaptainLogout";
// import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";
// import "remixicon/fonts/remixicon.css";
import FrontDashBoard from "./pages/FrontDashBoard";

import UserProtectWrapper from "./pages/UserProtectWrapper";
import { UserDataContext } from "./context/UserContext";
import Start from "./pages/Start";
import MedicieneSuggestion from "./Components/MedicieneSuggestion";
import AiChatBot from "./Components/AiChatBot";
import NewHome from "./utils/NewHome";
import CaptainLogout from "./pages/CaptainLogout";
import CaptainProtectWrapper from "./pages/CaptainProtectWrapper";
import { User } from "lucide-react";
const App = () => {
  const ans = useContext(UserDataContext);

  return (
    <div>
      <Routes>
        <Route path="/MedicieneSuggestion" element={<MedicieneSuggestion />} />
        <Route path="/AiChatBot" element={<AiChatBot />} />
        <Route path="/HospitalSuggestion" element={<HospitalSuggestion />} />
        <Route path="/UserRideShow" element={<UserRideShow />} />
        <Route path="/CaptainRiding" element={<CaptainRiding />} />
        <Route path="/Riding" element={<Riding />} />
        <Route path="/FrontDashBoard" element={<FrontDashBoard />} />
        <Route path="/" element={<Start />} />
        <Route path="/Userlogin" element={<UserLogin />} />
        <Route path="/UserSignup" element={<UserSignup />} />
        <Route path="/CaptainLogin" element={<CaptainLogin />} />
        <Route path="/CaptainSignup" element={<CaptainSignup />} />
        <Route
          path="/newHome"
          element={
            <UserProtectWrapper>
              <NewHome />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/home"
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/userLogout"
          element={
            <UserProtectWrapper>
              <UserLogout />
            </UserProtectWrapper>
          }
        />

        <Route
          path="/CaptainLogout"
          element={
            <CaptainProtectWrapper>
              <CaptainLogout />
            </CaptainProtectWrapper>
          }
        />
        <Route
          path="/CaptainHome"
          element={
            <CaptainProtectWrapper>
              <CaptainHome />
            </CaptainProtectWrapper>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
