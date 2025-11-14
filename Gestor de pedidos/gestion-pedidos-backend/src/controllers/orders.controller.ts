import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as ordersService from "../services/orders.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = Number(req.user?.id);
  const { items } = req.body;

  if (!userId) {
    res.status(401).json({ message: "Usuario no autenticado" });
    return;
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ message: "No hay productos en el pedido" });
    return;
  }

  console.log("🟢 Creando pedido nuevo para usuario:", userId, "items:", items);

  const order = await ordersService.createOrder(userId, items);
  res.status(201).json(order);
});

export const listOrders = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const orders = await ordersService.listAll();
  res.json(orders);
});

export const getOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const order = await ordersService.findById(id);
  res.json(order);
});

export const userOrders = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = Number(req.user?.id);

  if (!userId) {
    res.status(401).json({ message: "Usuario no autenticado" });
    return;
  }

  const orders = await ordersService.findByUser(userId);
  res.json(orders);
});
