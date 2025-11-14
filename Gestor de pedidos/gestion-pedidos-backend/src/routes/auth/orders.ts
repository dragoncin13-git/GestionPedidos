import { Router } from "express";

const router = Router();

let orders: any[] = []; // temporal (puedes conectar DB luego)

// Crear un pedido
router.post("/", (req, res) => {
  const { userId, items } = req.body;
  const order = {
    id: orders.length + 1,
    userId,
    items,
    fecha: new Date(),
    estado: "pendiente",
  };
  orders.push(order);
  res.json({ message: "Pedido creado correctamente", order });
});

// Ver pedidos por usuario
router.get("/user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const userOrders = orders.filter((o) => o.userId === id);
  res.json(userOrders);
});

// Ver todos los pedidos (admin)
router.get("/", (req, res) => {
  res.json(orders);
});

export default router;
