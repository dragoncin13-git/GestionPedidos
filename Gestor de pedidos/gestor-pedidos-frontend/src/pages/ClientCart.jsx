import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useState, useEffect } from "react";

export default function ClientCart() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState(location.state?.cart || []);

  // 🧠 Cargar carrito desde localStorage si no viene del estado
  useEffect(() => {
    if (!location.state?.cart) {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [location.state]);

  // 💾 Guardar automáticamente en localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🗑 Eliminar producto (versión completa y persistente)
  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item.id !== productId);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart)); // 🔥 guarda los cambios
  };

  // 🗑 Tu versión original (mantengo pero actualizo para persistir)
  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // ✅ ahora también persiste
  };

  // ✅ Confirmar pedido
  const confirmOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/orders",
        { items: cart.map((i) => ({ productId: i.id, quantity: i.quantity })) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Pedido confirmado");

      // 🔥 Limpia el carrito del estado y del localStorage
      setCart([]);
      localStorage.removeItem("cart");

      navigate("/client/orders");
    } catch (err) {
      console.error("❌ Error confirmando pedido:", err);
      alert("Error al confirmar pedido");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🛍 Mi Carrito</h2>
      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border p-3 rounded-lg"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={confirmOrder}
            className="mt-5 bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700"
          >
            Confirmar pedido
          </button>
        </>
      )}
    </div>
  );
}
