import { useState } from "react";
import api from "../api/api";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // 🔹 Si el usuario es el superadministrador (no registrado en la DB)
    if (email === "admin@ejem.com" && password === "admin") {
      const adminUser = {
        id: 1,
        nombre: "Super",
        apellido: "Administrador",
        correo: email,
        role: "admin", // 🔹 CORREGIDO: era "role" en minúscula
      };

      try {
        const response = await api.post("/auth/super-admin-login", { 
          correo: email, 
          password 
        });
        
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        alert("Bienvenido Super Administrador 👑");
        navigate("/admin/dashboard");
        return;
      } catch (error) {
        console.warn("Endpoint de super admin no disponible, usando token temporal");
        
        const temporaryToken = "super_admin_fallback_token";
        localStorage.setItem("token", temporaryToken);
        localStorage.setItem("user", JSON.stringify(adminUser));
        
        alert("Bienvenido Super Administrador 👑 (Modo temporal)");
        navigate("/admin/dashboard");
        return;
      }
    }

    // 🔹 Si es un usuario normal, usar la API
    try {
      const response = await api.post("/auth/login", { correo: email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert(`Bienvenido ${user.nombre} ${user.apellido}`);

      // 🔹 Redirigir según rol - CORREGIDO
      if (user.role === "admin") {
        navigate("/admin/home");
      } else {
        navigate("/client/home");
      }
    } catch (error) {
      alert("Correo o contraseña incorrectos ❌");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-image"></div>

        <form className="login-form" onSubmit={handleLogin}>
          <h2>Bienvenido ✨</h2>

          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="Tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn-login" type="submit">
            Iniciar sesión
          </button>

          <p className="login-links">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>

          <p className="login-links">
            {/* <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link> */}
          </p>
        </form>
      </div>
    </div>
  );
}