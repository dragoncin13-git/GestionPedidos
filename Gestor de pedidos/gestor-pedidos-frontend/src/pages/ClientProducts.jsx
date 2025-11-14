import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function ClientProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  // 🟢 Cargar carrito guardado
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // 🟢 NUEVO: Cargar productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 👇 Aquí va la corrección clave
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (err) {
        console.error("❌ Error al cargar productos:", err);
        // Fallback si el backend falla
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
  }, []); // 👈 Solo se ejecuta una vez

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    let newCart;

    if (existing) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));

    alert(`Agregado al carrito: ${product.name}`);
  };

  const updateQuantity = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, Number(value)) }));
  };

  if (loading) return <div className="p-6">Cargando productos...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Nuestros Productos</h1>

      <button
        onClick={() => navigate("/client/cart", { state: { cart } })}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-purple-700 transition"
      >
        🛒 Ver carrito ({cart.length})
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.image || "https://via.placeholder.com/300x200?text=Producto"}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600 text-sm mt-2">{product.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xl font-bold text-purple-600">${product.price}</span>
                <input
                  type="number"
                  min="1"
                  value={quantities[product.id] || 1}
                  onChange={(e) => updateQuantity(product.id, e.target.value)}
                  className="w-16 border rounded-lg text-center"
                />
              </div>
              <button
                onClick={() => addToCart(product)}
                className="mt-3 w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition"
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
