import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import OrderProgress from "../components/OrderProgress";
import { useAuth } from "../context/AuthContext";
import { ORDER_STATUS_LABELS } from "../constants/orderStatus";
import BogotaMap from "../components/BogotaMap"; // 🔥 NUEVA IMPORTACIÓN

export default function ClientOrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrder(res.data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el pedido");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  if (loading) return <div className="p-6">Cargando pedido...</div>;
  if (error) return <div className="p-6 text-red-300">{error}</div>;
  if (!order) return <div className="p-6">Pedido no encontrado</div>;

  const totalGeneral = order.items?.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const currentStatusLabel = ORDER_STATUS_LABELS[order.status] || order.status;

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Pedido #{order.id}</h1>
        <Link to="/client/orders" className="text-purple-400 hover:underline">
          ← Volver
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div className="flex flex-col gap-6">
          {/* Información del cliente */}
          <div className="card p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-3">Datos del cliente</h2>
            <div className="flex flex-col gap-1 text-sm opacity-90">
              <div><b>Nombre:</b> {order.user?.nombre} {order.user?.apellido}</div>
              <div><b>Teléfono:</b> {order.user?.telefono || "No registrado"}</div>
              <div><b>Dirección:</b> {order.user?.direccion || "No registrada"}</div>
              <div><b>Estado actual:</b> {currentStatusLabel}</div>
            </div>
          </div>

          {/* OrderProgress */}
          <OrderProgress status={order.status} />

          {/* Lista de productos */}
          <div className="card p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Productos</h2>
            <ul className="flex flex-col gap-4">
              {order.items?.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{item.product?.name}</div>
                    <div className="text-sm opacity-70">Cantidad: {item.quantity}</div>
                  </div>
                  <div className="font-bold text-purple-300">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Columna derecha - 🔥 NUEVO MAPA */}
        <div className="flex flex-col gap-6">
          <div className="card p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Seguimiento en Tiempo Real</h2>
            <div className="h-96 rounded-lg overflow-hidden">
              <BogotaMap 
                address={order.user?.direccion}
                orderStatus={order.status}
              />
            </div>
            <div className="mt-3 text-sm text-white/70">
              <p>📍 <b>Tu dirección:</b> {order.user?.direccion || "No especificada"}</p>
              <p className="mt-1">🚚 <b>Estado del pedido:</b> {currentStatusLabel}</p>
            </div>
          </div>

          {/* Totales */}
          <div className="card p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-3">Totales</h2>
            <div className="text-lg font-bold text-purple-300">
              Total del pedido: ${totalGeneral.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}