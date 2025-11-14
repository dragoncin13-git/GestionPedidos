import "../styles/DashboardAnimation.css";
import "../styles/CardStagger.css";
import StatsCards from "../components/StatsCards";
import PerformancePanel from "../components/PerformancePanel";

export default function Home() {
  // ⚠️ ELIMINA TODO ESTE USEEFFECT - Ya no es necesario porque PrivateRoute se encarga
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const user = localStorage.getItem("user");
  //
  //   if (!token || !user) {
  //     navigate("/login");
  //   }
  // }, [navigate]);

  return (
    <div className="p-6 dashboard-animate">
      <h2 className="text-3xl font-bold mb-6 text-purple-300">Panel de administración ✨</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Bienvenida */}
          <div className="card p-6 bg-gradient-to-r from-orange-500/20 to-rose-500/20">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-1">¡Bienvenido de nuevo! 👋</h3>
                <p className="opacity-80 text-sm">
                  ¡Buen trabajo! Tu restaurante vendió 20,000 platos en los últimos 90 días.
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30" />
            </div>
          </div>

          {/* Métricas rápidas */}
          <StatsCards />

          {/* Recent Sold */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4">Vendidos recientemente</h3>
            <div className="flex gap-4">
              <div className="w-28 h-24 rounded-xl bg-white/10 border border-white/20 grid place-items-center">🍔 Burger</div>
              <div className="w-28 h-24 rounded-xl bg-white/10 border border-white/20 grid place-items-center">🍣 Sushi</div>
              <div className="w-28 h-24 rounded-xl bg-white/10 border border-white/20 grid place-items-center">☕ Café</div>
            </div>
          </div>
        </div>

        {/* Panel de rendimiento */}
        <div>
          <PerformancePanel />
        </div>
      </div>
    </div>
  );
}