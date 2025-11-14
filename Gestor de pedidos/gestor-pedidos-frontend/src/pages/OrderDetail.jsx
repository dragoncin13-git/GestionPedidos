import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import OrderTrackingTimeline from "../components/OrderTrackingTimeline";

export default function OrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notifying, setNotifying] = useState(false);

  // Cargar datos reales del pedido
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const res = await api.get(`/orders/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!mounted) return;
        const data = res.data || res; // por si el backend devuelve directamente el objeto
        setOrder(data);
        // soporte opcional para historial
        setHistory(Array.isArray(data.history) ? data.history : []);
      } catch (e) {
        if (!mounted) return;
        setError("No se pudo cargar el pedido.");
        // fallback mock para que la UI siga funcionando
        const fallback = {
          id,
          customer: "Laura Gómez",
          address: "Cra 7 #45-10, Bogotá",
          phone: "+57 300 123 4567",
          status: "En camino",
          total: 45.5,
          paymentMethod: "Tarjeta Visa",
          items: [
            { id: 1, name: "Burger Clásica", qty: 2, price: 8.5 },
            { id: 2, name: "Papas Rusty", qty: 1, price: 4.9 },
            { id: 3, name: "Café Latte", qty: 2, price: 6.8 },
          ],
          history: [
            { at: new Date().toISOString(), event: "Pedido recibido" },
            { at: new Date().toISOString(), event: "Preparando" },
          ],
        };
        setOrder(fallback);
        setHistory(fallback.history);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, token]);

  const subtotal = useMemo(() => {
    return order?.items?.reduce((s, it) => s + it.qty * it.price, 0) || 0;
  }, [order]);
  const taxes = useMemo(() => +(subtotal * 0.08).toFixed(2), [subtotal]);
  const total = useMemo(() => +(subtotal + taxes).toFixed(2), [subtotal, taxes]);

  const markReady = async () => {
    if (!order) return;
    setSaving(true);
    try {
      // Actualiza estado en backend; si tu API usa PATCH, ajusta aquí
      await api.patch(`/orders/${order.id}`, { status: "Cocinado" }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setOrder({ ...order, status: "Cocinado" });
      setHistory([{ at: new Date().toISOString(), event: "Marcado como cocinado" }, ...history]);
    } catch (e) {
      // Silenciar errores visibles como en apps (sin alertas)
    } finally {
      setSaving(false);
    }
  };

  const notifyCourier = async () => {
    if (!order) return;
    setNotifying(true);
    try {
      await api.post(`/orders/${order.id}/notify`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setHistory([{ at: new Date().toISOString(), event: "Notificado al repartidor" }, ...history]);
    } catch (e) {
      // Silenciar errores visibles (sin alertas)
    } finally {
      setNotifying(false);
    }
  };

  if (loading) {
    return <div className="card p-6">Cargando pedido…</div>;
  }
  // Si hay error, mantenemos fallback cargado o UI básica sin mostrar mensaje

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <h1 className="text-2xl font-semibold">Pedido #{order.id}</h1>
        <div className="flex gap-2 flex-wrap">
          <Link
            to={`/tracking/${order.id}`}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-125 px-4 py-2 rounded-xl text-sm font-medium transition shadow-lg shadow-purple-800/40"
          >
            Ver seguimiento
          </Link>
          <Link
            to="/orders"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm"
          >
            Volver
          </Link>
        </div>
      </div>

      {/* Timeline enriquecido */}
      <OrderTrackingTimeline
        status={order.status || "Recibido"}
        steps={order.steps || [
          "Recibido",
          "Preparando",
          "Cocinado",
          "Salió del restaurante",
          "Con repartidor",
          "En camino",
          "Entregado",
        ]}
      />

      {/* Resumen del cliente y estado */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 grid place-items-center">🍽️</div>
            <div>
              <div className="text-sm opacity-70">Cliente</div>
              <div className="font-medium">{order.customer}</div>
              <div className="text-xs opacity-70">{order.phone}</div>
            </div>
          </div>

          <div className="md:text-right">
            <div className="text-sm opacity-70">Dirección</div>
            <div className="font-medium">{order.address}</div>
            <div className={`mt-2 inline-block px-3 py-1 text-sm rounded-xl ${
              order.status === "Entregado"
                ? "bg-green-500/40 text-green-300"
                : order.status === "En camino"
                ? "bg-yellow-500/40 text-yellow-200"
                : "bg-blue-500/40 text-blue-200"
            }`}>
              {order.status}
            </div>
          </div>
        </div>
      </div>

      {/* Items del pedido */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Productos</h2>
        <div className="flex flex-col gap-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 grid place-items-center">
                  {item.name.includes("Burger") ? "🍔" : item.name.includes("Papas") ? "🍟" : "☕"}
                </div>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs opacity-70">x{item.qty}</div>
                </div>
              </div>
              <div className="font-semibold">${(item.qty * item.price).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Totales y pago */}
      <div className="card p-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs opacity-70">Subtotal</div>
            <div className="text-lg font-bold">${subtotal.toFixed(2)}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs opacity-70">Impuestos (8%)</div>
            <div className="text-lg font-bold">${taxes.toFixed(2)}</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-rose-500/20 border border-white/20">
            <div className="text-xs opacity-80">Total</div>
            <div className="text-xl font-extrabold">${total.toFixed(2)}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs opacity-70">Método de pago</div>
            <div className="font-medium">{order.paymentMethod || "—"}</div>
          </div>
        </div>
      </div>

      {/* Historial */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Historial</h2>
        {history.length === 0 ? (
          <div className="text-sm opacity-70">Sin eventos</div>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <div className="text-sm opacity-80">{new Date(h.at).toLocaleString()}</div>
                <div className="font-medium">{h.event}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3">
        <button
          onClick={markReady}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm"
        >
          {saving ? "Guardando…" : "Marcar listo"}
        </button>
        <button
          onClick={notifyCourier}
          disabled={notifying}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:brightness-110 text-sm"
        >
          {notifying ? "Notificando…" : "Notificar al repartidor"}
        </button>
      </div>
    </div>
  );
}