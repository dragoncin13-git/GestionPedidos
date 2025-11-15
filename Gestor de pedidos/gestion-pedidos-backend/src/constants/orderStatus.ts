// src/constants/orderStatus.ts

const { OrderStatus } = require("@prisma/client");

/**
 * STATUS_MAP asegura que cada valor mapeado coincide con el ENUM Real de Prisma.
 */
export const STATUS_MAP: Record<string, typeof OrderStatus[keyof typeof OrderStatus]> = {
  "Recibido": OrderStatus.RECEIVED,
  "Preparando": OrderStatus.PREPARING,
  "Cocinado": OrderStatus.COOKING,
  "Salió del restaurante": OrderStatus.OUT_FOR_DELIVERY,
  "Con repartidor": OrderStatus.WITH_DRIVER,
  "En camino": OrderStatus.ON_THE_WAY,
  "Entregado": OrderStatus.DELIVERED,

  // También permitimos el ENUM directo:
  RECEIVED: OrderStatus.RECEIVED,
  PREPARING: OrderStatus.PREPARING,
  COOKING: OrderStatus.COOKING,
  OUT_FOR_DELIVERY: OrderStatus.OUT_FOR_DELIVERY,
  WITH_DRIVER: OrderStatus.WITH_DRIVER,
  ON_THE_WAY: OrderStatus.ON_THE_WAY,
  DELIVERED: OrderStatus.DELIVERED,
};
