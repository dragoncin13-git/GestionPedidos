import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import OrderProgress from "../components/OrderProgress";
import { ORDER_STEPS, ORDER_STATUS_LABELS } from "../constants/orderStatus";
import BogotaMap from "../components/BogotaMap";

export default function OrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        setOrder(res.data);
      } catch (err) {
        console.error("Error cargando pedido:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  const subtotal = useMemo(() => {
    return order?.items?.reduce((s, it) => s + it.quantity * it.price, 0) || 0;
  }, [order]);

  const advanceStatus = async () => {
    const currentIndex = ORDER_STEPS.indexOf(order.status);
    if (currentIndex === ORDER_STEPS.length - 1) return;

    const nextStatus = ORDER_STEPS[currentIndex + 1];

    try {
      setSaving(true);
      await api.patch(
        `/orders/${order.id}`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrder({ ...order, status: nextStatus });
    } catch (e) {
      console.error("Error avanzando estado:", e);
    } finally {
      setSaving(false);
    }
  };

  // 🔥 FUNCIÓN SIMPLIFICADA - SOLO REDIRIGE
  const finishOrder = () => {
    navigate('/admin/orders');
  };

  if (loading) return <div className="p-6">Cargando pedido...</div>;
  if (!order) return <div className="p-6">Pedido no encontrado</div>;

  const currentStatusLabel = ORDER_STATUS_LABELS[order.status] || order.status;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Pedido #{order.id}</h1>

        <Link
          to="/admin/orders"
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
        >
          Volver
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda - Información del pedido */}
        <div className="flex flex-col gap-6">
          {/* Información del cliente */}
          <div className="card p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-3">Cliente</h2>

            <div className="text-sm opacity-90 flex flex-col gap-1">
              <div><b>Nombre:</b> {order.user?.nombre} {order.user?.apellido}</div>
              <div><b>Teléfono:</b> {order.user?.telefono}</div>
              <div><b>Dirección:</b> {order.user?.direccion}</div>
              <div><b>Estado actual:</b> {currentStatusLabel}</div>
            </div>
          </div>

          {/* Seguimiento */}
          <OrderProgress status={order.status} />

          {/* Productos */}
          <div className="card p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-3">Productos</h2>

            <div className="flex flex-col gap-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{item.product.name}</div>
                    <div className="text-sm opacity-70">x{item.quantity}</div>
                  </div>

                  <div className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totales */}
          <div className="card p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-3">Total</h2>

            <div className="text-xl font-bold text-purple-300">
              ${subtotal.toFixed(2)}
            </div>
          </div>

          {/* 🔥 BOTONES MANTENIDOS */}
          <div className="flex gap-4 mt-4">
            {/* AVANZAR */}
            {order.status !== "DELIVERED" && (
              <button
                onClick={advanceStatus}
                disabled={saving}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Avanzar estado"}
              </button>
            )}

            {/* FINALIZAR - 🔥 AHORA SOLO REDIRIGE */}
            {order.status === "DELIVERED" && (
              <button
                onClick={finishOrder}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl"
              >
                Terminar pedido
              </button>
            )}
          </div>
        </div>

        {/* Columna derecha - 🔥 NUEVO MAPA */}
        <div className="flex flex-col gap-6">
          <div className="card p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Seguimiento en Mapa</h2>
            <div className="h-96 rounded-lg overflow-hidden">
              <BogotaMap 
                address={order.user?.direccion}
                orderStatus={order.status}
              />
            </div>
            <div className="mt-3 text-sm text-white/70">
              <p>📍 <b>Dirección de entrega:</b> {order.user?.direccion}</p>
              <p className="mt-1">🚚 <b>Estado:</b> {currentStatusLabel}</p>
            </div>
          </div>

          {/* Información adicional si necesitas */}
          <div className="card p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-3">Información del Pedido</h2>
            <div className="text-sm opacity-90 flex flex-col gap-2">
              <div><b>ID del Pedido:</b> #{order.id}</div>
              <div><b>Fecha:</b> {new Date(order.createdAt).toLocaleDateString()}</div>
              <div><b>Estado:</b> <span className="text-purple-300">{currentStatusLabel}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}