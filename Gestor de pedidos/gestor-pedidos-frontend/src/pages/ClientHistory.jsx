import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function ClientHistory() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchHistory = async () => {
      try {
        const res = await api.put(`/orders/${order.id}/received`, {}, {
  headers: { Authorization: `Bearer ${token}` },
});
        const data = Array.isArray(res.data) ? res.data : [];
        // 🔹 Mostrar solo los pedidos entregados
        setOrders(data.filter(o => o.status?.toLowerCase() === "delivered" || o.status?.toLowerCase() === "entregado"));
      } catch (err) {
        console.error("Error cargando historial:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  if (loading) return <div className="card p-6">Cargando historial...</div>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Historial de pedidos</h1>
      {orders.length === 0 ? (
        <div className="card p-6 col-span-full text-center opacity-70">
          No tienes pedidos completados aún.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders.map(order => (
            <div
              key={order.id}
              className="card p-6 flex flex-col justify-between border border-white/10 hover:border-green-400/30 transition"
            >
              <div className="flex flex-col gap-2">
                <div className="text-sm opacity-70">Pedido #{order.id}</div>
                <div className="text-lg font-semibold">
                  {order.items?.reduce((acc, i) => acc + (i.quantity || 0), 0)} productos
                </div>
                <div className="text-sm opacity-70">Total: ${order.total.toFixed(2)}</div>
                <div className="text-green-400 font-medium mt-1">✔ Entregado</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
