import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { BrowserRouter } from "react-router-dom";

const convexUrl = import.meta.env.VITE_CONVEX_URL || "https://good-impala-784.eu-west-1.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      ConvexProvider,
      { client: convex },
      React.createElement(
        BrowserRouter,
        null,
        React.createElement(App, null)
      )
    )
  )
);