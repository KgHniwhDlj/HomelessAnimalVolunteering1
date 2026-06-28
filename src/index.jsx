import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import AdminPage from "./AdminPage";
import AuthorizationPage from "./AuthorizationPage";
import Animal from "./AnimalPage";
import App from "./App";


const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);