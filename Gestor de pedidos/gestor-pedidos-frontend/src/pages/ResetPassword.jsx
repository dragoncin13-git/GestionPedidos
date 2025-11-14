import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";
import "../styles/Register.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Falta el token de recuperación en la URL.");
      return;
    }

    if (password.length < 6) {
      alert("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      await api.post("/auth/reset-password", { token, password });
      alert("Contraseña actualizada correctamente. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err) {
      alert("No se pudo actualizar la contraseña. Intenta nuevamente.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-image"></div>

        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Crear nueva contraseña</h2>

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button className="register-button" type="submit">
            Guardar contraseña
          </button>

          <p className="register-footer">
            ¿Recordaste tu contraseña? <Link to="/login">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}