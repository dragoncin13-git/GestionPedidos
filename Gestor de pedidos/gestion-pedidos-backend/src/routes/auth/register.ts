import { Router } from "express";
import { registerUser, loginUser } from "../../controllers/auth.controller"; // 👈 ajusta la ruta según tu estructura

const router = Router();

// 📝 Ejemplo del body esperado (solo referencia, no código real)
// {
//   "nombre": "Juan",
//   "apellido": "Pérez",
//   "correo": "juan@example.com",
//   "telefono": "3001234567",
//   "ubicacion": "Bogotá",
//   "password": "123456"
// }

// Ruta para registrar usuarios
router.post("/register", registerUser);

// Ruta para login
router.post("/login", loginUser);

export default router;
