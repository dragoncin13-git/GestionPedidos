// src/pages/ClientProducts.jsx
import { useEffect, useState } from "react";
import api from "../api/api";

export default function ClientProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({}); // cantidad por producto

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([
          { id: 1, name: "Latte Caramelo", description: "Café espresso suave con leche cremosa y caramelo artesanal.", price: 4.5, image: "https://i.pinimg.com/736x/d6/b6/90/d6b690846428f05ce46e6161a8c17800.jpg" },
          { id: 2, name: "Muffin de Chocolate", description: "Bizcocho esponjoso con doble cacao y chispas premium.", price: 2.3, image: "https://i.pinimg.com/736x/5c/e2/8d/5ce28d09477b5eae5f7618e2e72820b9.jpg" },
          { id: 3, name: "Té Matcha", description: "Matcha japonés con espuma ligera y toque dulce.", price: 3.9, image: "https://i.pinimg.com/736x/7c/99/e0/7c99e00e34632f905de0520e661bb34e.jpg" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // inicializa cantidades en 1
    const q = {};
    products.forEach(p => { q[p.id] = q[p.id] || 1; });
    setQuantities(q);
  }, [products]);

  const updateQuantity = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, Number(value)) }));
  };

  const addToCart = (product) => {
    const qty = Number(quantities[product.id] || 1);
    const existing = cart.find(item => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: qty }];
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  if (loading) return <div className="p-6">Cargando productos...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Nuestros Productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden shadow-md">
            <img
              src={product.image || "https://via.placeholder.com/300x200?text=Producto"}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-100">{product.name}</h3>
              <p className="text-gray-300 text-sm mt-2 line-clamp-3">{product.description}</p>

              <div className="flex items-center justify-between mt-4 gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(product.id, Math.max(1, (quantities[product.id] || 1) - 1))}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20"
                  >-</button>
                  <input
                    type="number"
                    min="1"
                    value={quantities[product.id] || 1}
                    onChange={(e) => updateQuantity(product.id, e.target.value)}
                    className="w-16 text-center rounded-lg bg-black/20 p-1"
                  />
                  <button
                    onClick={() => updateQuantity(product.id, (quantities[product.id] || 1) + 1)}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20"
                  >+</button>
                </div>

                <div className="text-xl font-bold text-purple-300">${Number(product.price).toFixed(2)}</div>
              </div>

              <button
                onClick={() => addToCart(product)}
                className="mt-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-105 text-white px-4 py-2 rounded-lg transition"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
