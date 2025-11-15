// src/pages/ClientCart.jsx
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useState, useEffect } from "react";

export default function ClientCart() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState(() => {
    const fromState = location.state?.cart;
    if (fromState) {
      localStorage.setItem("cart", JSON.stringify(fromState));
      return fromState;
    }
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // sincroniza si otro tab cambia el localStorage
    const handler = () => {
      const saved = localStorage.getItem("cart");
      setCart(saved ? JSON.parse(saved) : []);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const removeItem = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const confirmOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/orders",
        { items: cart.map((i) => ({ productId: i.id, quantity: i.quantity })) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Pedido confirmado");
      setCart([]);
      localStorage.removeItem("cart");
      // avisar a otras vistas para refrescar (ej. mis pedidos)
      window.dispatchEvent(new Event("refreshOrders"));
      navigate("/client/orders");
    } catch (err) {
      console.error("❌ Error confirmando pedido:", err);
      alert("Error al confirmar pedido");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Mi Carrito</h2>
      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center border p-3 rounded-lg">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm opacity-70">Cantidad: {item.quantity}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-right">
            <button
              onClick={confirmOrder}
              className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700"
            >
              Confirmar pedido
            </button>
          </div>
        </>
      )}
    </div>
  );
}
