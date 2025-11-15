import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function AdminHistory() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api
      .get("/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const delivered = res.data.filter(o =>
          ["entregado", "delivered"].includes(o.status.toLowerCase())
        );
        setOrders(delivered);
      });
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Historial de pedidos</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order.id} className="card p-4 border border-white/10">
            <div className="text-sm opacity-80">Pedido #{order.id}</div>
            <div className="text-sm">
              Cliente: {order.user?.nombre} {order.user?.apellido}
            </div>
            <div className="text-sm">Total: ${order.total}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
