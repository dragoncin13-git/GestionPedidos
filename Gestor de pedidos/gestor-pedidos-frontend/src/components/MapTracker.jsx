import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const riderIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, map.getZoom(), { duration: 0.6 });
  }, [position]);
  return null;
}

function AutoResize() {
  const map = useMap();
  useEffect(() => {
    const invalidate = () => map.invalidateSize();
    const id = setTimeout(invalidate, 200);
    window.addEventListener("resize", invalidate);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", invalidate);
    };
  }, [map]);
  return null;
}

function FitToRoute({ positions, running }) {
  const map = useMap();
  useEffect(() => {
    if (running) return; // cuando está corriendo, preferimos seguir al marcador
    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [positions, running]);
  return null;
}

export default function MapTracker({ running = false }) {
  // Bogotá-like route (lat,lng pairs)
  const path = [
    [4.6351, -74.0820], // restaurante
    [4.6405, -74.0750],
    [4.6450, -74.0720],
    [4.6480, -74.0690],
    [4.6505, -74.0660],
    [4.6530, -74.0625],
    [4.6555, -74.0600], // cliente
  ];

  const [posIdx, setPosIdx] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setPosIdx((i) => (i < path.length - 1 ? i + 1 : i));
    }, 1200);
    return () => clearInterval(id);
  }, [running]);

  const marker = path[posIdx];

  return (
    <div className="card p-4">
      <div className="mb-3 flex justify-between items-center">
        <div className="font-semibold">Ubicación del repartidor</div>
        <div className={`text-xs px-2 py-1 rounded ${running ? "bg-green-500/30 text-green-200" : "bg-white/10"}`}>
          {running ? "En movimiento" : "Detenido"}
        </div>
      </div>

      <div className="relative w-full h-64 sm:h-72 lg:h-80 rounded-xl overflow-hidden border border-white/10">
        <MapContainer center={path[0]} zoom={14} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Polyline positions={path} color="#a48af9" weight={4} opacity={0.8} />
          <Marker position={marker} icon={riderIcon} />
          <FlyTo position={marker} />
          <FitToRoute positions={path} running={running} />
          <AutoResize />
        </MapContainer>
      </div>

      <div className="mt-2 text-xs opacity-70 flex justify-between">
        <span>Restaurante (origen)</span>
        <span>Cliente (destino)</span>
      </div>
    </div>
  );
}