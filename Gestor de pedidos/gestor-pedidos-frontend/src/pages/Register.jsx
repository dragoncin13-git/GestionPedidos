import { useState } from "react";
import api from "../api/api";
import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    ubicacion: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      alert("Registro exitoso ✅");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("❌ Error al registrarse: Verifica los datos o si ya existe el correo/teléfono");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-image"></div>

        <form className="register-form" onSubmit={handleRegister}>
          <h2>Crear cuenta</h2>

          <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
          <input name="apellido" placeholder="Apellido" onChange={handleChange} required />
          <input name="correo" placeholder="Correo electrónico" type="email" onChange={handleChange} required />
          <input name="telefono" placeholder="Teléfono" type="tel" onChange={handleChange} required />
          <input name="ubicacion" placeholder="Ubicación" onChange={handleChange} required />
          <input name="password" placeholder="Contraseña" type="password" onChange={handleChange} required />

          <button className="register-button" type="submit">Registrarse</button>

          <p className="register-footer">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
