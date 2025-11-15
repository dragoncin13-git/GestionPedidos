import express from "express";
import prisma from "../prismaClient";
import { authenticate, AuthRequest } from "../middlewares/auth.middleware";
import * as ordersController from "../controllers/orders.controller";

const router = express.Router();

// 🟣 Nuevo endpoint para actualizar estado
router.patch("/:id", authenticate, ordersController.updateOrderStatus);

// 🟢 Crear pedido
router.post("/", authenticate, ordersController.createOrder);

// 🟢 Obtener pedidos de un usuario autenticado
router.get("/user", authenticate, ordersController.userOrders);

// 🟢 Obtener todos los pedidos (admin)
router.get("/", authenticate, ordersController.listOrders);

// 🟢 Obtener pedido por ID
router.get("/:id", authenticate, ordersController.getOrder);

// 🟢 Marcar pedido como recibido (cliente)
router.put("/:id/received", authenticate, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Usuario no autenticado" });

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Pedido no encontrado" });

    if (existing.userId !== userId) {
      return res.status(403).json({ message: "No puedes modificar este pedido" });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: "DELIVERED" },
    });

    res.json({ message: "Pedido marcado como recibido", order });
  } catch (error: any) {
    console.error("❌ Error al marcar recibido:", error);
    res.status(500).json({ message: "Error al marcar como recibido" });
  }
});

export default router;
