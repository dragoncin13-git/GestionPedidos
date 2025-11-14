import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Si el id es "create", redirigir a la página de creación
  useEffect(() => {
    if (id === "create") {
      navigate("/products/create");
      return;
    }
  }, [id, navigate]);

  useEffect(() => {
    // Si el id es "create", no hacer la petición
    if (id === "create") {
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const res = await api.get(`/products/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!mounted) return;

        const data = res.data;
        setProduct({
          id: data.id ?? id,
          name: data.name ?? "Producto",
          description: data.description ?? "Descripción no disponible.",
          price: String(data.price ?? "0.00"),
          image: data.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
          tags: Array.isArray(data.tags) ? data.tags : ["General"],
        });

      } catch (e) {
        if (!mounted) return;

        console.error("Error loading product:", e);
        setError("No se pudo cargar el producto.");

        // Fallback solo si es un ID numérico válido
        if (!isNaN(Number(id))) {
          const fallback = {
            id: id,
            name: "Producto no encontrado",
            description: "Este producto no existe o fue eliminado.",
            price: "0.00",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
            tags: ["No disponible"],
          };
          setProduct(fallback);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [id, token, navigate]);

  // Si estamos en modo "create", no renderizar nada (ya que redirigimos)
  if (id === "create") {
    return null;
  }

  if (loading) {
    return <div className="card p-6">Cargando producto…</div>;
  }

  if (error && !product) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Error</h1>
          <Link to="/products" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm">
            Volver a productos
          </Link>
        </div>
        <div className="card p-6 text-red-200">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Producto no encontrado</h1>
          <Link to="/products" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm">
            Volver a productos
          </Link>
        </div>
        <div className="card p-6">
          <p>El producto que buscas no existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <div className="flex gap-2 flex-wrap">
          <Link
            to={`/products/${product.id}/edit`}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-125 px-4 py-2 rounded-xl text-sm font-medium transition shadow-lg shadow-purple-800/40"
          >
            Editar
          </Link>
          <Link
            to="/products"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm"
          >
            Volver
          </Link>
        </div>
      </div>

      {/* Imagen y resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-0 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 md:h-72 object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop";
            }}
          />
        </div>
        <div className="card p-6 flex flex-col gap-4">
          {/* Descripción */}
          <div>
            <div className="text-sm opacity-70">Descripción</div>
            <p className="opacity-90 mb-2">{product.description}</p>

            {/* Nueva ubicación de disponibilidad */}
            <div className="text-sm mt-2">
              <span className="opacity-70">Disponibilidad: </span>
              <span className={`font-semibold ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}>
                {product.stock > 0 ? "Disponible" : "Sin stock del producto"}
              </span>
            </div>
          </div>

          {/* Etiquetas */}
          <div className="flex gap-2 flex-wrap">
            {product.tags.map((t) => (
              <span key={t} className="px-3 py-1 rounded-xl bg-white/10 text-xs">{t}</span>
            ))}
          </div>

          {/* Precio */}
          <div className="mt-auto">
            <div className="text-xs opacity-70">Precio</div>
            <div className="text-xl font-bold text-purple-300">${product.price}</div>
          </div>
        </div>

      </div>
    </div>
  );
}