import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 🔹 Interfaz del payload del token
export interface UserPayload {
  id: number;
  correo: string;
  role: string;
  nombre?: string;
  apellido?: string;
  iat?: number;
  exp?: number;
}

// 🔹 Extiende Request para incluir user
export interface AuthRequest extends Request {
  user?: UserPayload;
}

// 🔹 Middleware para autenticar usuarios
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verificando token:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// 🔹 Middleware para verificar si el usuario es admin
export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado: solo administradores" });
  }
  next();
};
export default {
  authenticate,
  authorizeAdmin,
};