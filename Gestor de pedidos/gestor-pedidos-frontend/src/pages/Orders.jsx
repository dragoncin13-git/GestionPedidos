// src/pages/Orders.jsx
import OrderCard from "../components/OrderCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import { ORDER_STATUS_LABELS } from "../constants/orderStatus";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await api.get("/orders", { headers: { Authorization: `Bearer ${token}` } });
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error cargando pedidos (admin):", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="p-6">Cargando pedidos…</div>;

  const notDelivered = orders.filter(o => !(o.status === "DELIVERED" || o.status === "Entregado"));

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Pedidos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {notDelivered.length === 0 ? (
          <div className="card p-6 col-span-full text-center opacity-70">No hay pedidos pendientes</div>
        ) : (
          notDelivered.map((order) => (
            <div key={order.id} className="card p-6 border border-white/10 flex flex-col gap-4">
              {/* OrderCard actualizado - mostrará estado en español con colores */}
              <OrderCard order={order} />
              
              {/* 🔥 BOTÓN DENTRO DEL CONTENEDOR */}
              <Link
                to={`/admin/orders/${order.id}`}
                className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-center text-sm font-medium transition-colors"
              >
                Ver detalles del pedido
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}