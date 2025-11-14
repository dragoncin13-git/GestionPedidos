import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      // Si no hay sesión, redirigimos al login
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkBase = "block px-4 py-2 rounded-xl transition";
  const linkActive = "bg-white/10 text-white shadow-[inset_0_0_8px_rgba(255,255,255,0.08)]";
  const linkInactive = "text-white/80 hover:bg-white/5";

  return (
    <aside className="w-64 shrink-0 p-6 bg-[#201631] border-r border-white/10 min-h-screen rounded-r-3xl">
      {/* Perfil */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30" />
        <div>
          <div className="text-sm opacity-70">Bienvenido de vuelta</div>
          <div className="text-lg font-semibold">
            {user ? `${user.nombre} ${user.apellido}` : "Cargando..."}
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-2">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          Products
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          Orders
        </NavLink>
        <NavLink
          to="/products/create"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          Create product
        </NavLink>
      </nav>

      {/* Botón de logout */}
      <button
        onClick={handleLogout}
        className="mt-8 text-white/70 text-sm hover:text-white transition"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}
