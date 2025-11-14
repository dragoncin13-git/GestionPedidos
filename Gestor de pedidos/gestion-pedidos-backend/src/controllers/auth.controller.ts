import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { AuthRequest } from "../middlewares/auth.middleware"; // ✅ ya existe aquí
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

/**
 * Registro de usuario
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, correo, telefono, ubicacion, password } = req.body;

    if (!nombre || !apellido || !correo || !telefono || !ubicacion || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el correo o teléfono ya existen
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ correo }, { telefono }],
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Correo o teléfono ya registrados" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Determinar rol (solo si es el admin específico)
    // ✅ después
    const role = correo === "admin@ejem.com" && password === "admin" ? "admin" : "user";


    const newUser = await prisma.users.create({
      data: {
        nombre,
        apellido,
        correo,
        telefono,
        ubicacion,
        password: hashedPassword,
        role,
      },
    });

    const { password: _, ...userData } = newUser;
    res.status(201).json({ message: "Usuario registrado exitosamente", user: userData });
  } catch (error) {
    console.error("Error en registerUser:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Inicio de sesión
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: "Correo y contraseña son requeridos" });
    }

    const user = await prisma.users.findUnique({ where: { correo } });

    if (!user) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { id: user.id, correo: user.correo, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const { password: _, ...userData } = user;

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Error en loginUser:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Actualización de perfil de usuario
 */

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id; // ✅ ya no hace falta userId || id

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const { nombre, apellido, correo, telefono, ubicacion, password } = req.body;

    if (!nombre || !apellido || !correo || !telefono || !ubicacion) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const existingEmail = await prisma.users.findFirst({
      where: { correo, NOT: { id: userId } },
    });

    if (existingEmail) {
      return res.status(409).json({ message: "El correo ya está en uso" });
    }

    const existingPhone = await prisma.users.findFirst({
      where: { telefono, NOT: { id: userId } },
    });

    if (existingPhone) {
      return res.status(409).json({ message: "El teléfono ya está en uso" });
    }

    let hashedPassword: string | undefined;
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        nombre,
        apellido,
        correo,
        telefono,
        ubicacion,
        ...(hashedPassword ? { password: hashedPassword } : {}),
      },
    });

    const { password: _, ...safeUser } = updatedUser;
    res.json({ message: "Datos actualizados correctamente", user: safeUser });
  } catch (error) {
    console.error("Error en updateUser:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};