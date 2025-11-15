import { ORDER_STEPS, ORDER_STATUS_LABELS } from "../constants/orderStatus";

export default function OrderTrackingTimeline({ status }) {
  const currentIndex = ORDER_STEPS.indexOf(status);

  return (
    <div className="card p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-6">Estado del pedido</h2>

      <div className="flex flex-col gap-6 md:gap-8">
        {ORDER_STEPS.map((step, i) => (
          <div key={i} className="flex items-center gap-3 md:gap-4">
            {/* Circle */}
            <div className={`w-4 h-4 md:w-6 md:h-6 rounded-full border 
              ${i <= currentIndex 
                ? "bg-purple-500 border-purple-300 shadow-[0_0_10px_2px_rgba(164,138,249,0.6)]"
                : "bg-white/5 border-white/20"
              }`}>
            </div>

            {/* Line */}
            {i < ORDER_STEPS.length - 1 && (
              <div className={`flex-1 h-[2px] md:h-1 rounded-full
                ${i < currentIndex 
                  ? "bg-purple-400 shadow-[0_0_12px_2px_rgba(164,138,249,0.4)]"
                  : "bg-white/10"
                }`}>
              </div>
            )}

            {/* Step name - 🔥 CAMBIO AQUÍ */}
            <div className={`text-xs md:text-sm ${i <= currentIndex ? "text-purple-200 font-medium" : "opacity-50"}`}>
              {ORDER_STATUS_LABELS[step]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}