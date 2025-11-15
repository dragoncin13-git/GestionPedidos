// src/components/OrderCard.jsx
import { ORDER_STATUS_LABELS } from "../constants/orderStatus";

export default function OrderCard({ order }) {
  // 🔥 FUNCIÓN PARA OBTENER COLOR SEGÚN ESTADO
  const getStatusColor = (status) => {
    const statusColors = {
      PENDING: "bg-blue-500 text-white",
      RECEIVED: "bg-blue-400 text-white", 
      PREPARING: "bg-yellow-500 text-white",
      COOKING: "bg-orange-500 text-white",
      OUT_FOR_DELIVERY: "bg-purple-500 text-white",
      WITH_DRIVER: "bg-indigo-500 text-white",
      ON_THE_WAY: "bg-pink-500 text-white",
      DELIVERED: "bg-green-500 text-white"
    };
    
    return statusColors[status] || "bg-gray-500 text-white";
  };

  const total = order.items?.reduce((acc, item) => acc + (item.price * item.quantity || 0), 0) || 0;
  const productsCount = order.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Header con número de pedido y estado */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm opacity-70">Pedido #{order.id}</div>
          <div className="text-lg font-semibold">{productsCount} producto{productsCount !== 1 ? 's' : ''}</div>
        </div>
        
        {/* 🔥 ESTADO EN ESPAÑOL CON COLOR */}
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
          {ORDER_STATUS_LABELS[order.status] || order.status}
        </span>
      </div>

      {/* Información del cliente */}
      <div className="text-sm opacity-80">
        <div><b>Cliente:</b> {order.user?.nombre} {order.user?.apellido}</div>
        <div><b>Teléfono:</b> {order.user?.telefono || "No registrado"}</div>
      </div>

      {/* Total */}
      <div className="text-lg font-bold text-purple-300">
        ${total.toFixed(2)}
      </div>

      {/* 🔥 ELIMINADO EL BOTÓN "VER DETALLE" DUPLICADO */}
    </div>
  );
}