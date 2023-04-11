import React from "react";
import ReactDOM from "react-dom/client";
import suprsend from "@suprsend/web-sdk";
import "./index.css";
import App from "./App";

suprsend.init(
  process.env.REACT_APP_WORKSPACE_KEY,
  process.env.REACT_APP_WORKSPACE_SECRET,
  {
    api_url: process.env.REACT_APP_COLLECTOR_URL,
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);
