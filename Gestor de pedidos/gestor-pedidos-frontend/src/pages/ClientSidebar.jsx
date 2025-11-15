import { NavLink, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ClientSidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkBase =
    "block px-4 py-2 rounded-xl transition text-sm font-medium";
  const linkActive =
    "bg-white/10 text-white shadow-[inset_0_0_8px_rgba(255,255,255,0.08)]";
  const linkInactive = "text-white/80 hover:bg-white/5";

  return (
    <aside className="w-64 shrink-0 p-6 bg-[#201631] border-r border-white/10 min-h-screen rounded-r-3xl">
      {/* Perfil */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30" />
        <div>
          <div className="text-sm opacity-70">Bienvenido</div>
          <div className="text-lg font-semibold">
            {user ? `${user.nombre} ${user.apellido}` : "Cargando..."}
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-2">
        <NavLink
          to="/client/products"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          Inicio
        </NavLink>

        <NavLink
          to="/client/orders"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          Mis pedidos
        </NavLink>

        {/* 🔥 ELIMINADO "Mi cuenta" */}

        <Link
          to="/client/history"
          className="block px-4 py-2 hover:bg-white/10 transition rounded-lg"
        >
          Historial
        </Link>
      </nav>

      {/* Carrito - 🔥 SIMPLIFICADO */}
      <Link
        to="/client/cart"
        className="block px-4 py-2 mt-4 rounded-xl text-center font-medium bg-purple-600 hover:bg-purple-700 transition"
      >
        Ver carrito
      </Link>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-8 text-white/70 text-sm hover:text-white transition"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}