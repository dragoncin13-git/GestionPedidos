import { ORDER_STEPS, ORDER_STATUS_LABELS } from "../constants/orderStatus";

export default function OrderProgress({ status }) {
  const currentIndex = ORDER_STEPS.indexOf(status);

  return (
    <div className="flex flex-col gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
      <h3 className="font-semibold text-lg mb-2">Estado del pedido</h3>

      <div className="flex flex-col gap-2">
        {ORDER_STEPS.map((step, index) => (
          <div
            key={step}
            className={`flex items-center gap-2 text-sm ${
              index <= currentIndex ? "text-green-300" : "text-white/40"
            }`}
          >
            <span className="w-3 h-3 rounded-full border border-white/20 bg-white/10"></span>
            {/* 🔥 CAMBIO AQUÍ: Usar ORDER_STATUS_LABELS en lugar de step */}
            {ORDER_STATUS_LABELS[step]}
          </div>
        ))}
      </div>
    </div>
  );
}