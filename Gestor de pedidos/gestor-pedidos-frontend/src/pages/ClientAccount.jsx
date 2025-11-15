// src/pages/ClientAccount.jsx
import { useState, useEffect } from "react";
import api from "../api/api";
import { Eye, EyeOff } from "lucide-react";

export default function ClientAccount() {
  const [user, setUser] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(stored);
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.put("/users/update", user, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = res.data.user || res.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMessage("✅ Cambios guardados correctamente");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 409) setMessage("⚠️ Correo o teléfono ya están en uso");
      else setMessage("❌ Error al guardar cambios");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="p-6 dashboard-animate min-h-screen bg-[#1a1027] text-white">
      <h2 className="text-3xl font-bold mb-6 text-purple-300">👤 Mi cuenta</h2>

      {message && (
        <div className="mb-4 bg-white/10 p-3 rounded-lg text-center">
          {message}
        </div>
      )}

      <div className="card bg-white/5 p-6 rounded-2xl shadow-lg max-w-2xl mx-auto space-y-4">
        <div>
          <label className="block text-sm opacity-70 mb-1">Nombre</label>
          <input
            name="nombre"
            value={user.nombre || ""}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white/10 border border-white/20"
          />
        </div>

        <div>
          <label className="block text-sm opacity-70 mb-1">Apellido</label>
          <input
            name="apellido"
            value={user.apellido || ""}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white/10 border border-white/20"
          />
        </div>

        <div>
          <label className="block text-sm opacity-70 mb-1">Correo</label>
          <input
            name="correo"
            type="email"
            value={user.correo || ""}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white/10 border border-white/20"
          />
        </div>

        <div>
          <label className="block text-sm opacity-70 mb-1">Teléfono</label>
          <input
            name="telefono"
            type="tel"
            value={user.telefono || ""}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white/10 border border-white/20"
          />
        </div>

        <div>
          <label className="block text-sm opacity-70 mb-1">Ubicación</label>
          <input
            name="ubicacion"
            value={user.ubicacion || ""}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white/10 border border-white/20"
          />
        </div>

        <div className="relative">
          <label className="block text-sm opacity-70 mb-1">Contraseña</label>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={user.password || ""}
            onChange={handleChange}
            className="w-full p-2 pr-10 rounded-lg bg-white/10 border border-white/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-white/70 hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 transition p-2 rounded-lg font-semibold"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
