import { Router, Request, Response } from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware";
import prisma from "../prismaClient";

const router = Router();

// ✅ Listar todos los productos
const listProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, image, imageUrl } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Nombre y precio son requeridos" });
    }

    // ✅ Conversión de tipos
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock) || 0;

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: "El precio debe ser un número válido" });
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        price: parsedPrice,
        stock: parsedStock,
        // Si tienes campo de imagen
        ...(imageUrl ? { image: imageUrl } : {}),
      },
    });

    res.status(201).json({ message: "Producto creado correctamente", product });
  } catch (error: any) {
    console.error("❌ Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
};
// 👇 Mantenemos las rutas protegidas
router.post("/", authenticate, authorizeAdmin, createProduct);
router.get("/", async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// ✅ Actualizar producto
const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, stock, image } = req.body;
  try {
    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        stock,
        image: image || null,
      },
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id: Number(id) } });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

// Public routes
router.get("/", listProducts);
router.get("/:id", getProduct);

// Protected routes (admin)
router.post("/", authenticate, authorizeAdmin, createProduct);
router.put("/:id", authenticate, authorizeAdmin, updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

export default router;