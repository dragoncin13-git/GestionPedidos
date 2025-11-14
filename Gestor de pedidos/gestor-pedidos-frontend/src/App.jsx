import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import ClientSidebar from "./pages/ClientSidebar";
import ClientAccount from "./pages/ClientAccount";
import ClientHistory from "./pages/ClientHistory";
import ClientOrders from "./pages/ClientOrders";
import ClientCart from "./pages/ClientCart";
import ClientProducts from "./pages/ClientProducts";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import ProductCreate from "./pages/ProductCreate";
import ProductEdit from "./pages/ProductEdit";
import ProductDetail from "./pages/ProductDetail";
import OrderTracking from "./pages/OrderTracking";
import OrderDetail from "./pages/OrderDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

function Layout() {
  const location = useLocation();
  const hideSidebar = ["/login", "/register", "/reset-password"].includes(location.pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsAdmin(user.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    }
    setIsLoading(false);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1b1525] text-white">
        <div>Cargando...</div>
      </div>
    );
  }

  if (hideSidebar) {
    return (
      <div className="bg-[#1b1525] min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="flex bg-[#1b1525] text-white min-h-screen">
      <div>
  {isAdmin ? <Sidebar /> : <ClientSidebar />}
</div>

      <main className="flex-1 p-0 sm:p-8">
        <Navbar onMenuToggle={() => setMobileMenuOpen(true)} />

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 sm:hidden">
            <button
              className="absolute inset-0 bg-black/50"
              aria-label="Cerrar menú"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-72 bg-[#201631] border-r border-white/10 shadow-xl rounded-r-3xl overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="text-lg font-semibold">Menú</div>
                <button
                  className="p-2 rounded-lg bg-white/10 border border-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ✕
                </button>
              </div>
              {isAdmin ? <Sidebar /> : <ClientSidebar />}
            </div>
          </div>
        )}

        <div className="h-full">
          <Routes>
            {/* --- ADMIN --- */}
            <Route path="/admin/dashboard" element={<PrivateRoute role="admin"><Home /></PrivateRoute>} />
            <Route path="/products" element={<PrivateRoute role="admin"><Products /></PrivateRoute>} />
            <Route path="/products/create" element={<PrivateRoute role="admin"><ProductCreate /></PrivateRoute>} />
            <Route path="/products/:id/edit" element={<PrivateRoute role="admin"><ProductEdit /></PrivateRoute>} />
            <Route path="/products/:id" element={<PrivateRoute role="admin"><ProductDetail /></PrivateRoute>} />
            <Route path="/admin/orders" element={<PrivateRoute role="admin"><Orders /></PrivateRoute>} />
            <Route path="/admin/orders/:id" element={<PrivateRoute role="admin"><OrderDetail /></PrivateRoute>} />

            {/* --- CLIENTE --- */}
            <Route path="/client/products" element={
              <PrivateRoute>
                <ClientProducts />   {/* 🛒 Muestra los productos */}
              </PrivateRoute>
            } />
            <Route path="/client/orders" element={
              <PrivateRoute>
                <ClientOrders />     {/* 📦 Muestra los pedidos */}
              </PrivateRoute>
            } />
            <Route path="/client/cart" element={
  <PrivateRoute>
    <ClientCart />
  </PrivateRoute>
} />

            <Route path="/client/account" element={<PrivateRoute><ClientAccount /></PrivateRoute>} />
            <Route path="/client/history" element={<ClientHistory />} />

            {/* --- PÚBLICAS --- */}
            <Route path="/tracking/:id" element={<OrderTracking />} />

            {/* --- HOME INTELIGENTE --- */}
            <Route path="/" element={<PrivateRoute>{isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/client/products" />}</PrivateRoute>} />

            <Route path="*" element={<PrivateRoute>{isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/client/products" />}</PrivateRoute>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
