import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Clean raw URL string from markdown formatting or accidental quotes
const rawUrl = import.meta.env.VITE_CONVEX_URL || "https://good-impala-784.eu-west-1.convex.cloud"\;
const cleanUrl = rawUrl.replace(/\[?(https?:\/\/[^\]\s"]+)\]?\(?.*/, "$1").trim();

const convex = new ConvexReactClient(cleanUrl);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>
);
