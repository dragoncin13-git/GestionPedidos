import OrderCard from "../components/OrderCard";
import { Link } from "react-router-dom";

const dummyOrders = [
  { id: 101, customer: "Laura Gómez", items: [{},{}], status: "Procesando", total: "45.50" },
  { id: 102, customer: "Carlos Pérez", items: [{}], status: "En camino", total: "18.99" },
  { id: 103, customer: "Ana Ruiz", items: [{},{},{}], status: "Entregado", total: "62.10" },
];

export default function Orders() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Pedidos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {dummyOrders.map((order) => (
          <div key={order.id} className="flex flex-col gap-3">
            <OrderCard order={order} />
            <Link
              to={`/tracking/${order.id}`}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-sm w-fit"
            >
              Ver seguimiento
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
