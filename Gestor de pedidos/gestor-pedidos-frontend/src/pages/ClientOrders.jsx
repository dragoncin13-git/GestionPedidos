import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function ClientOrders() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const filteredOrders = orders.filter(order => order.status !== "DELIVERED");

  // 🔹 Nueva función para reutilizar en varios puntos
  const fetchOrders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/orders/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data : [];
      setOrders(data);

      // Buscar pedido activo
      const active = data
  .filter((o) =>
    ["pendiente", "pending", "en proceso", "processing"].includes(
      o.status?.toLowerCase()
    )
  )
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

setActiveOrder(active || null);
      setActiveOrder(active || null);
    } catch (err) {
      console.error("❌ Error cargando pedidos:", err);
      setError("No se pudieron cargar los pedidos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cargar pedidos iniciales
  useEffect(() => {
    fetchOrders();
  }, [token]);

  // 🔹 Escuchar evento global para refrescar pedidos después de crear o marcar recibido
  useEffect(() => {
    const reload = () => fetchOrders();
    window.addEventListener("refreshOrders", reload);
    return () => window.removeEventListener("refreshOrders", reload);
  }, [token]);

  if (loading) {
    return <div className="card p-6">Cargando pedidos...</div>;
  }

  if (error) {
    return <div className="card p-6 text-red-300">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Mis pedidos</h1>
        <div className="text-sm opacity-70">
          Bienvenido, <span className="font-medium">{user?.nombre}</span>
        </div>
      </div>

      {/* Pedido activo */}
      {activeOrder && (
        <div className="card p-5 border border-yellow-400/20 bg-yellow-900/10 shadow-md">
          <h2 className="text-lg font-semibold text-yellow-300">Pedido activo</h2>
          <p className="text-sm opacity-80 mt-1">
            Pedido #{activeOrder.id} — {activeOrder.items?.length || 0} productos.
          </p>
          <p className="text-sm mt-1 opacity-70">
            Tiempo estimado de entrega:{" "}
            <span className="font-medium text-yellow-200">≈ 10 minutos</span>
          </p>
          <Link
            to={`/client/orders/${activeOrder.id}`}
            className="text-sm text-purple-400 hover:underline mt-2 inline-block"
          >
            Ver detalles del pedido →
          </Link>
        </div>
      )}

      {/* Lista de pedidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {orders.length === 0 ? (
          <div className="card p-6 col-span-full text-center opacity-70">
            Aún no has realizado ningún pedido.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="card p-6 flex flex-col justify-between border border-white/10 hover:border-purple-400/30 transition"
            >
              <div className="flex flex-col gap-2">
                <div className="text-sm opacity-70">Pedido #{order.id}</div>
                <div className="text-lg font-semibold">
                  {order.items?.reduce((acc, item) => acc + (item.quantity || 0), 0)} productos
                </div>
                <div className="text-sm opacity-80">
                  Estado:{" "}
                  <span
                    className={`font-medium ${["entregado", "delivered"].includes(order.status?.toLowerCase())
                        ? "text-green-400"
                        : ["pendiente", "pending"].includes(order.status?.toLowerCase())
                          ? "text-yellow-400"
                          : "text-purple-300"
                      }`}
                  >
                    {{
                      pendiente: "Pendiente",
                      pending: "Pendiente",
                      entregado: "Entregado",
                      delivered: "Entregado",
                      "en proceso": "En proceso",
                      processing: "En proceso",
                    }[order.status?.toLowerCase()] || order.status}
                  </span>
                </div>
                <div className="text-sm opacity-70">
                  Total:{" "}
                  <span className="font-medium text-purple-300">
                    $
                    {order.items
                      ?.reduce((acc, item) => acc + (item.price * item.quantity || 0), 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* 🔥 SOLO BOTÓN "VER DETALLES" - ELIMINADO "MARCAR COMO RECIBIDO" */}
              <Link
                to={`/client/orders/${order.id}`}
                className="mt-4 block w-full text-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:brightness-110 transition text-sm font-medium"
              >
                Ver detalles
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}