import prisma from "../prismaClient";

export async function create(data: { name: string; description?: string; price: number; stock?: number; }) {
  return prisma.product.create({ data });
}

export async function listAll() {
  return prisma.product.findMany();
}

export async function findById(id: number) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Producto no encontrado");
  return product;
}

export async function update(id: number, data: { name?: string; description?: string; price?: number; stock?: number; }) {
  await findById(id);
  return prisma.product.update({ where: { id }, data });
}

export async function remove(id: number) {
  await findById(id);
  return prisma.product.delete({ where: { id } });
}
