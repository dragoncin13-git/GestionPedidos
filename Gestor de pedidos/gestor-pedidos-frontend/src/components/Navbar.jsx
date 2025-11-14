import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();

  return (
    <nav className="sm:hidden bg-[#201631] border-b border-white/10 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {/* Hamburger en móvil */}
        <button
          className="md:hidden p-2 rounded-lg bg-white/10 border border-white/10"
          aria-label="Abrir menú"
          onClick={onMenuToggle}
        >
          <span className="block w-5 h-[2px] bg-white mb-1"></span>
          <span className="block w-5 h-[2px] bg-white mb-1"></span>
          <span className="block w-5 h-[2px] bg-white"></span>
        </button>
        <Link to="/" className="text-xl font-extrabold text-purple-300 tracking-wide">
          Gestor Pedidos
        </Link>
      </div>

      {/* En móvil no mostramos acciones; sólo el disparador del menú lateral */}
    </nav>
  );
}
