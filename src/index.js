import React from "react";
import ReactDOM from "react-dom/client";
import suprsend from "@suprsend/web-sdk";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

suprsend.init(
  process.env.REACT_APP_WORKSPACE_KEY,
  process.env.REACT_APP_WORKSPACE_SECRET_KEY,
  {
    api_url: process.env.REACT_APP_COLLECTOR_URL,
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
