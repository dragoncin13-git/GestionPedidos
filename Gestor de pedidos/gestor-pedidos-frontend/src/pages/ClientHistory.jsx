import { useEffect, useState } from "react";
import api from "../api/api";

export default function ClientHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/orders/user", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const delivered = res.data.filter(o => o.status === "DELIVERED");
        setOrders(delivered);
      } catch (err) {
        console.error("Error cargando historial:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Historial de pedidos</h2>

      {orders.length === 0 ? (
        <p>No tienes pedidos recibidos todavía.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order.id} className="border p-4 rounded-lg">
              <div className="font-bold">Pedido #{order.id}</div>
              <div>Estado: ✔ Recibido</div>
              <div>Total: ${order.total}</div>
              <div className="mt-2 opacity-70 text-sm">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
