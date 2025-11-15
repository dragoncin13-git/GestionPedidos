import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const BogotaMap = ({ address, orderStatus }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Coordenadas de Bogotá, Colombia
    const bogotaCoords = [4.7110, -74.0721];

    // Inicializar mapa
    const map = L.map(mapRef.current).setView(bogotaCoords, 12);

    // Agregar capa de tiles (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Marcador principal en Bogotá
    const mainMarker = L.marker(bogotaCoords)
      .addTo(map)
      .bindPopup('<b>Bogotá, Colombia</b><br>Zona de entrega')
      .openPopup();

    // Agregar marcadores según el estado del pedido
    addStatusBasedMarkers(map, orderStatus, bogotaCoords);

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [address, orderStatus]);

  // Función para agregar marcadores basados en el estado del pedido
  const addStatusBasedMarkers = (map, status, bogotaCoords) => {
    const statusMarkers = {
      PENDING: [
        [4.7110, -74.0721, 'Restaurante', '⏳ Pedido pendiente']
      ],
      RECEIVED: [
        [4.7110, -74.0721, 'Restaurante', '✅ Pedido recibido']
      ],
      PREPARING: [
        [4.7110, -74.0721, 'Restaurante', '🍽️ Preparando tu pedido']
      ],
      COOKING: [
        [4.7110, -74.0721, 'Cocina', '👨‍🍳 Cocinando']
      ],
      OUT_FOR_DELIVERY: [
        [4.7110, -74.0721, 'Punto de partida', '🚗 Pedido despachado'],
        [4.6980, -74.0830, 'En camino', '📦 Repartidor en movimiento']
      ],
      WITH_DRIVER: [
        [4.6980, -74.0830, 'Repartidor', '🚚 Con repartidor'],
        [4.6850, -74.0940, 'Zona de entrega', '📍 Próxima entrega']
      ],
      ON_THE_WAY: [
        [4.6850, -74.0940, 'Cercano a destino', '🏠 Llegando a tu ubicación']
      ],
      DELIVERED: [
        [4.6850, -74.0940, 'Ubicación de entrega', '✅ Pedido entregado']
      ]
    };

    const markers = statusMarkers[status] || [
      [4.7110, -74.0721, 'Centro de Bogotá', '📍 Pedido recibido']
    ];

    markers.forEach(([lat, lng, title, description]) => {
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>${title}</b><br>${description}`);
    });

    // Ajustar el zoom para mostrar todos los marcadores
    if (markers.length > 1) {
      const group = new L.featureGroup(markers.map(([lat, lng]) => L.marker([lat, lng])));
      map.fitBounds(group.getBounds().pad(0.1));
    }
  };

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg border border-white/10"
      style={{ background: '#1b1525' }}
    />
  );
};

export default BogotaMap;