export default function PerformancePanel() {
  const clients = [
    { name: "Alex" },
    { name: "Jane" },
    { name: "Jimmy" },
    { name: "Susan" },
  ];

  const metrics = [
    { label: "Ingresos totales", value: "$ 1.4K", trend: "+19%", color: "bg-green-600/20 text-green-200" },
    { label: "Menos vendido", value: "$ 0.3K", trend: "-5%", color: "bg-red-500/20 text-red-200" },
    { label: "Más vendido", value: "$ 1.0K", trend: "+23%", color: "bg-amber-500/20 text-amber-200" },
  ];

  return (
    <div className="card p-6 bg-amber-400/10 border-amber-300/20">
      <h2 className="text-xl font-semibold mb-4">Rendimiento del restaurante</h2>

      <div className="mb-5">
        <div className="text-sm opacity-80 mb-2">Clientes nuevos (21)</div>
        <div className="flex -space-x-2">
          {clients.map((c, i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-white/20 border border-white/30 grid place-items-center text-xs">
              {c.name[0]}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {metrics.map((m) => (
          <div key={m.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">{m.label}</div>
              <div className={`text-xs px-2 py-1 rounded ${m.color}`}>{m.trend}</div>
            </div>
            <div className="text-lg font-bold">{m.value}</div>
            <div className="mt-2 h-2 rounded bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-rose-500" style={{ width: m.label === "Ingresos totales" ? "70%" : m.label === "Más vendido" ? "85%" : "35%" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}