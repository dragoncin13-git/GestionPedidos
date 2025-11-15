// src/pages/Home.jsx
import "../styles/DashboardAnimation.css";
import "../styles/CardStagger.css";
import StatsCards from "../components/StatsCards";
import PerformancePanel from "../components/PerformancePanel";
import { useEffect, useState } from "react";
import api from "../api/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const [pRes, oRes] = await Promise.all([
          api.get("/products", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/orders",   { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setProducts(pRes.data || []);
        setOrders(oRes.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // calcula top vendidos a partir de items
  const topSold = (() => {
    const counter = {};
    (orders || []).forEach(o => {
      (o.items || []).forEach(it => {
        const pid = it.product?.id || it.productId || it.id;
        const name = it.product?.name || it.name || "Producto";
        counter[pid] = counter[pid] || { name, qty: 0 };
        counter[pid].qty += it.quantity || it.qty || 0;
      });
    });
    return Object.values(counter).sort((a,b) => b.qty - a.qty).slice(0,3);
  })();

  return (
    <div className="p-6 dashboard-animate">
      <h2 className="text-3xl font-bold mb-6 text-purple-300">Panel de administración ✨</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="card p-6 bg-gradient-to-r from-orange-500/20 to-rose-500/20">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-1">¡Bienvenido de nuevo! 👋</h3>
                <p className="opacity-80 text-sm">
                  Resumen rápido de productos y pedidos.
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30" />
            </div>
          </div>

          <StatsCards orders={orders} products={products} />

          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4">Vendidos recientemente (estimado)</h3>
            <div className="flex gap-4">
              {topSold.length === 0 ? (
                <div className="text-sm opacity-70">Sin datos aún</div>
              ) : topSold.map((t, idx) => (
                <div key={idx} className="w-28 h-24 rounded-xl bg-white/10 border border-white/20 grid place-items-center">
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs opacity-70">x{t.qty}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <PerformancePanel orders={orders} products={products} />
        </div>
      </div>
    </div>
  );
}
