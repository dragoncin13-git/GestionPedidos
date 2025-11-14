import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as usersService from "../services/users.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔹 Obtener perfil del usuario autenticado
export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = Number(req.user?.id);
  const user = await usersService.findById(userId);
  res.json(user);
});

// 🔹 Listar todos los usuarios (solo admin)
export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await usersService.listAll();
  res.json(users);
});

// 🔹 Actualizar datos del usuario
export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { nombre, apellido, correo, telefono, ubicacion, password } = req.body;

  const existingUser = await prisma.users.findUnique({ where: { id: Number(id) } });
  if (!existingUser) {
    res.status(404).json({ message: "Usuario no encontrado" });
    return;
  }

  const duplicate = await prisma.users.findFirst({
    where: {
      OR: [{ correo }, { telefono }],
      NOT: { id: Number(id) },
    },
  });

  if (duplicate) {
    res.status(409).json({ message: "El correo o teléfono ya están en uso" });
    return;
  }

  const dataToUpdate: any = { nombre, apellido, correo, telefono, ubicacion };
  if (password) {
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await prisma.users.update({
    where: { id: Number(id) },
    data: dataToUpdate,
  });

  res.json({ message: "Usuario actualizado exitosamente", user: updatedUser });
});
