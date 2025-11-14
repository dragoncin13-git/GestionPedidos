import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import morgan from "morgan";
import productRoutes from "./routes/products.routes";
import ordersRoutes from "./routes/orders.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);

// Ruta de prueba
app.get("/api/test", (req, res) => {
  res.json({ message: "API funcionando correctamente" });
});

// Ruta de prueba específica para auth
app.get("/api/auth/test", (req, res) => {
  res.json({ message: "Auth routes funcionando" });
});

export default app;

