// backend/src/routes/products.ts
import { Router } from "express";

const router = Router();

const products = [
  { id: 1, nombre: "Pizza Margarita", descripcion: "Queso mozzarella y tomate", precio: 25000 },
  { id: 2, nombre: "Hamburguesa Doble", descripcion: "Carne 100% res con papas", precio: 20000 },
  { id: 3, nombre: "Jugo Natural", descripcion: "Mango o piña", precio: 8000 },
];

router.get("/", (req, res) => res.json(products));

export default router;
