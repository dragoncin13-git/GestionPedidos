import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as productsService from "../services/products.service";

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, price, stock } = req.body;
  const product = await productsService.create({ name, description, price: Number(price), stock: Number(stock) });
  res.status(201).json(product);
});

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await productsService.listAll();
  res.json(products);
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = await productsService.findById(id);
  res.json(product);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, description, price, stock } = req.body;
  const product = await productsService.update(id, { name, description, price: Number(price), stock: Number(stock) });
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await productsService.remove(id);
  res.status(204).end();
});
