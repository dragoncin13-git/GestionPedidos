import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProductEdit from "../pages/ProductEdit.jsx";
import { AuthProvider } from "../context/AuthContext";

// Mock de API para evitar llamadas reales
vi.mock("../api/api", () => ({
  default: {
    get: vi.fn().mockRejectedValue(new Error("ECONNREFUSED")),
    put: vi.fn().mockResolvedValue({ status: 200 }),
  },
}));

const renderWithRouter = (initialPath) => {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/products/:id/edit" element={<ProductEdit />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
};

describe("ProductEdit - validaciones del formulario", () => {
  it("muestra mensajes de error cuando los campos son inválidos", async () => {
    const user = userEvent.setup();
    renderWithRouter("/products/1/edit");

    // Espera a que finalice la carga inicial (fallback del API)
    await waitFor(() => {
      expect(screen.queryByText(/Cargando producto…/i)).not.toBeInTheDocument();
    });

    // Campos
    const inputNombre = screen.getByLabelText(/Nombre/i);
    const inputPrecio = screen.getByLabelText(/Precio/i);
    const inputDescripcion = screen.getByLabelText(/Descripción/i);
    const inputImagen = screen.getByLabelText(/Imagen \(URL\)/i);

    // Fuerza valores inválidos
    await user.clear(inputNombre); // vacío

    await user.clear(inputPrecio);
    await user.type(inputPrecio, "0"); // <= 0

    await user.clear(inputDescripcion);
    await user.type(inputDescripcion, "muy corto"); // < 10

    await user.clear(inputImagen);
    await user.type(inputImagen, "not-a-url"); // inválida

    // Enviar formulario
    const submitBtn = screen.getByRole("button", { name: /Guardar/i });
    await user.click(submitBtn);

    // Mensajes de validación esperados (muestran precio, imagen y descripción)
    const precioMsgs = await screen.findAllByText(/El precio debe ser mayor a 0/i);
    expect(precioMsgs.length).toBeGreaterThan(0);
    const descMsgs = await screen.findAllByText(/La descripción debe tener al menos 10 caracteres/i);
    expect(descMsgs.length).toBeGreaterThan(0);
    const imgMsgs = await screen.findAllByText(/URL de imagen inválida/i);
    expect(imgMsgs.length).toBeGreaterThan(0);
  });
});