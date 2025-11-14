import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findById = async (id: number) => {
  return prisma.users.findUnique({ where: { id } });
};

export const listAll = async () => {
  return prisma.users.findMany();
};

// 🔹 Buscar por correo, excluyendo un ID (para validar duplicados)
export const findByEmailExceptId = async (correo: string, id: number) => {
  return prisma.users.findFirst({
    where: { correo, NOT: { id } },
  });
};

// 🔹 Buscar por teléfono, excluyendo un ID (para validar duplicados)
export const findByPhoneExceptId = async (telefono: string, id: number) => {
  return prisma.users.findFirst({
    where: { telefono, NOT: { id } },
  });
};

// 🔹 Actualizar usuario
export const updateUser = async (id: number, data: any) => {
  return prisma.users.update({
    where: { id },
    data,
  });
};
