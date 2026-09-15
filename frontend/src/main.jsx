import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";

// Context Providers
import UserContext from "./context/UserContext.jsx";
import CaptainContext from "./context/CaptainContext.jsx";
import { LocationProvider } from "./context/searchContext.jsx";
import { CaptainDataProvider } from "./context/CaptainDataProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContext>
      <CaptainContext>
        <LocationProvider>
          <CaptainDataProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </CaptainDataProvider>
        </LocationProvider>
      </CaptainContext>
    </UserContext>
  </StrictMode>
);
