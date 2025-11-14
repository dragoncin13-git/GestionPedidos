export default function StatsCards() {
  const stats = [
    { label: "Favoritos", value: "+6.9K", color: "bg-rose-500/20 text-rose-200", icon: "🍰" },
    { label: "Añadidos al carrito", value: "+2.4K", color: "bg-amber-500/20 text-amber-200", icon: "🛒" },
    { label: "Pedidos", value: "+1.0K", color: "bg-green-600/20 text-green-200", icon: "🥗" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{s.icon}</span>
            <div className={`inline-block px-3 py-1 rounded ${s.color} text-xs font-semibold`}>{s.label}</div>
          </div>
          <div className="text-2xl font-bold">{s.value}</div>
        </div>
      ))}
    </div>
  );
}