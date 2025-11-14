import { useState } from "react";
import { useParams } from "react-router-dom";
import OrderTrackingTimeline from "../components/OrderTrackingTimeline";
import MapTracker from "../components/MapTracker";

export default function OrderTracking() {
  const { id } = useParams();

  const steps = [
    "Recibido",
    "Preparando",
    "Cocinado",
    "Salió del restaurante",
    "Con repartidor",
    "En camino",
    "Entregado",
  ];

  const [status, setStatus] = useState("Recibido");
  const [running, setRunning] = useState(false);

  const items = [
    { id: 1, name: "Latte Caramelo" },
    { id: 2, name: "Muffin de Chocolate" },
    { id: 3, name: "Té Matcha" },
  ];

  const advanceStatus = () => {
    const idx = steps.indexOf(status);
    if (idx < steps.length - 1) {
      const next = steps[idx + 1];
      setStatus(next);
      if (next === "Con repartidor" || next === "En camino") {
        setRunning(true);
      }
      if (next === "Entregado") {
        setRunning(false);
      }
    }
  };

  const markCookedAndStart = (itemId) => {
    // Al marcar un producto/receta como cocinado, pasa a "Cocinado" y comienza el recorrido.
    setStatus("Cocinado");
    // Opcional: se podría persistir el itemId que disparó el evento
    setRunning(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Seguimiento del pedido #{id}</h1>
        <button
          onClick={advanceStatus}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-125 px-4 py-2 rounded-xl text-sm font-medium transition shadow-lg shadow-purple-800/40"
        >
          Avanzar estado
        </button>
      </div>

      {/* Timeline */}
      <OrderTrackingTimeline status={status} steps={steps} />

      {/* Items: clic para marcar cocinado e iniciar recorrido */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Productos del pedido</h2>
        <div className="flex flex-wrap gap-3">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => markCookedAndStart(it.id)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm"
              title="Marcar como cocinado y empezar recorrido"
            >
              {it.name}
            </button>
          ))}
        </div>
        <p className="opacity-80 mt-4 text-sm">Haz clic en un producto ya cocinado para iniciar el recorrido (como en Rappi).</p>
      </div>

      {/* Map tracker */}
      <MapTracker running={running} />

      {/* Footer note */}
      <div className="card p-6">
        <p className="opacity-80">
          Estado actual: <span className="font-medium text-purple-200">{status}</span>.
          {running ? " El repartidor está en movimiento." : " Esperando siguiente etapa."}
        </p>
      </div>
    </div>
  );
}
