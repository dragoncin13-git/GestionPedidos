// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // <-- importa el provider
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App /> {/* ahora Navbar dentro de App tendrá acceso al contexto */}
    </AuthProvider>
  </React.StrictMode>
);
