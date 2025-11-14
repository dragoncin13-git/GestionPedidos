import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { registerUser, loginUser, updateUser } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Endpoint especial para super admin
router.post("/super-admin-login", (req: Request, res: Response) => {
  const { correo, password } = req.body;

  // Verificar credenciales del super admin
  if (correo === "admin@ejem.com" && password === "admin") {
    // Generar token JWT válido
    const token = jwt.sign(
      { 
        userId: 1, 
        role: "admin",
        nombre: "Super",
        apellido: "Administrador",
        correo: "admin@ejem.com"
      }, 
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "24h" }
    );

    return res.json({
      token,
      user: {
        id: 1,
        nombre: "Super",
        apellido: "Administrador", 
        correo: "admin@ejem.com",
        role: "admin"
      }
    });
  } else {
    return res.status(401).json({ error: "Credenciales de super admin inválidas" });
  }
});

// Tus rutas existentes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/users/update", authenticate, updateUser);

export default router;