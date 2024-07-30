import React from "react";
import ReactDOM from "react-dom/client";
import ReactGA from 'react-ga4';
import "@/style/globals.scss";
import App from "@/App";

// Initialize GA4 with your Measurement ID
ReactGA.initialize('G-TNJV1F1410'); // Replace with your Measurement ID

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
