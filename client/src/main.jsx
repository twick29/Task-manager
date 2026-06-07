import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// ─── Mount React App ──────────────────────────────────────────────────────
// Find the <div id="root"> in index.html and inject the App inside it

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);