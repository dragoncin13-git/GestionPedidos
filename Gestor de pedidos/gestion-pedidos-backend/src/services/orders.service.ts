// src/services/orders.service.ts
import prisma from "../prismaClient";
import { STATUS_MAP } from "../constants/orderStatus";
import { OrderStatus } from "@prisma/client";

type OrderItemInput = { productId: number; quantity: number; };

export async function createOrder(userId: number, items: OrderItemInput[]) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error("Items required");
  }

  // Buscar productos
  const productIds = items.map(i => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  if (products.length !== productIds.length) {
    throw new Error("Uno o más productos no existen");
  }

  let total = 0;
  const createItemsData = items.map(item => {
    const prod = products.find(p => p.id === item.productId)!;
    if (prod.stock < item.quantity) {
      throw new Error(`Stock insuficiente para el producto ${prod.name}`);
    }
    const price = prod.price;
    total += price * item.quantity;
    return {
      product: { connect: { id: prod.id } },
      quantity: item.quantity,
      price
    };
  });

  // 🧾 Transacción: crear orden y actualizar stock
  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        user: { connect: { id: userId } },
        total,
        status: "PENDING",
      }
    });

    for (const it of items) {
      await tx.orderItem.create({
        data: {
          order: { connect: { id: createdOrder.id } },
          product: { connect: { id: it.productId } },
          quantity: it.quantity,
          price: products.find(p => p.id === it.productId)!.price
        }
      });

      // Decrementar stock
      const prod = products.find(p => p.id === it.productId)!;
      await tx.product.update({
        where: { id: prod.id },
        data: { stock: prod.stock - it.quantity }
      });
    }

    // 🔁 Devolver orden con relaciones completas
    return tx.order.findUnique({
      where: { id: createdOrder.id },
      include: { items: { include: { product: true } }, user: true }
    });
  });

  return order;
}

export async function listAll() {
  return prisma.order.findMany({
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function findById(id: number) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, user: true },
  });
  if (!order) throw new Error("Orden no encontrada");
  return order;
}

/**
 * updateStatus:
 * - busca el mapeo string -> valor aceptado por Prisma (STATUS_MAP)
 * - valida que exista
 * - fuerza un cast a OrderStatus para satisfacer la firma de prisma
 */
export async function updateStatus(id: number, status: string) {
  const mappedStr = STATUS_MAP[status]; // puede venir "RECEIVED" etc (string)
  if (!mappedStr) {
    throw new Error("Estado inválido: " + status);
  }

  // Forzamos el tipo a OrderStatus para Prisma (safe porque STATUS_MAP solo contiene valores válidos)
  const mapped = mappedStr as unknown as OrderStatus;

  return prisma.order.update({
    where: { id },
    data: { status: mapped },
    include: {
      items: { include: { product: true } },
      user: true,
    },
  });
}

export async function findByUser(userId: number) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: "desc" },
  });
}
