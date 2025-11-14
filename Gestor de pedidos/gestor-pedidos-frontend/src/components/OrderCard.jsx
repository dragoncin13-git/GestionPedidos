import { Link } from "react-router-dom";

export default function OrderCard({ order }) {
  return (
    <div className="card p-5 flex flex-col gap-3 hover:scale-[1.02] transition">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Pedido #{order.id}</h3>

        <span className={`px-3 py-1 text-sm rounded-xl ${
          order.status === "Entregado"
            ? "bg-green-500/40 text-green-300"
            : order.status === "En camino"
            ? "bg-yellow-500/40 text-yellow-200"
            : "bg-blue-500/40 text-blue-200"
        }`}>
          {order.status}
        </span>
      </div>

      {/* Cliente */}
      <div className="text-sm opacity-80">
        Cliente: <span className="font-medium">{order.customer}</span>
      </div>

      {/* Productos */}
      <div className="text-xs opacity-60">
        {order.items.length} productos
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-3">
        <div className="font-bold text-[1.1rem]">{order.total} USD</div>

        <Link
          to={`/orders/${order.id}`}
          className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-sm"
        >
          Ver detalle
        </Link>
      </div>
    </div>
  );
}
