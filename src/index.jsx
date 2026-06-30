import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import AdminPage from "./pages/AdminPage";
import AuthorizationPage from "./pages/AuthorizationPage";
import Animal from "./pages/AnimalPage";
import App from "./App";


const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);