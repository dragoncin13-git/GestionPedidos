import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error al cargar los productos");
        // Fallback a datos dummy si el backend falla
        setProducts([
          { id: 1, name: "Latte Caramelo", description: "Café espresso suave con leche cremosa y caramelo artesanal.", price: "4.50", image: "https://i.pinimg.com/736x/d6/b6/90/d6b690846428f05ce46e6161a8c17800.jpg" },
          { id: 2, name: "Muffin de Chocolate", description: "Bizcocho esponjoso con doble cacao y chispas premium.", price: "2.30", image: "https://i.pinimg.com/736x/5c/e2/8d/5ce28d09477b5eae5f7618e2e72820b9.jpg" },
          { id: 3, name: "Té Matcha", description: "Matcha japonés con espuma ligera y toque dulce.", price: "3.90", image: "https://i.pinimg.com/736x/7c/99/e0/7c99e00e34632f905de0520e661bb34e.jpg" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Productos</h1>
          <Link to="/products/create" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-125 px-4 py-2 rounded-xl text-sm font-medium transition shadow-lg shadow-purple-800/40">
            + Agregar Producto
          </Link>
        </div>
        <div className="card p-6">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Productos</h1>
        <Link to="/products/create" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-125 px-4 py-2 rounded-xl text-sm font-medium transition shadow-lg shadow-purple-800/40">
          + Agregar Producto
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="card p-6 text-center">
          <p className="opacity-70">No hay productos disponibles</p>
          <Link to="/products/create" className="inline-block mt-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-125 px-4 py-2 rounded-xl text-sm font-medium transition">
            Crear primer producto
          </Link>
        </div>
      )}
    </div>
  );
}