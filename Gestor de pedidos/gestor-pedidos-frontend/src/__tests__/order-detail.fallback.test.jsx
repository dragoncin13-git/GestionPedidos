import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import OrderDetail from "../pages/OrderDetail.jsx";
import { AuthProvider } from "../context/AuthContext";

// Mock de API para simular backend caído
vi.mock("../api/api", () => ({
  default: {
    get: vi.fn().mockRejectedValue(new Error("ECONNREFUSED")),
    patch: vi.fn(),
    post: vi.fn(),
  },
}));

const renderWithRouter = (initialPath) => {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
};

describe("OrderDetail - fallback cuando backend no responde", () => {
  it("muestra datos de fallback y mantiene la UI usable", async () => {
    renderWithRouter("/orders/101");

    // Primero se muestra el loader
    expect(screen.getByText(/Cargando pedido…/i)).toBeInTheDocument();

    // Luego de resolver la promesa rechazada, debe aparecer el pedido con fallback
    await waitFor(() => {
      expect(screen.getByText(/Pedido #101/i)).toBeInTheDocument();
    });

    // Cliente de fallback
    expect(screen.getByText(/Laura Gómez/i)).toBeInTheDocument();

    // Botones de acción siguen presentes
    expect(screen.getByRole("button", { name: /Marcar listo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Notificar al repartidor/i })).toBeInTheDocument();

    // Productos listados del fallback
    expect(screen.getByText(/Burger Clásica/i)).toBeInTheDocument();
    expect(screen.getByText(/Papas Rusty/i)).toBeInTheDocument();
    expect(screen.getByText(/Café Latte/i)).toBeInTheDocument();
  });
});