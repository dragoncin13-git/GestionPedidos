import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const register = async (data: {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  ubicacion: string;
  password: string;
}, roleFromLogic?: Role) => {
  const existing = await prisma.users.findUnique({ where: { correo: data.correo } });
  if (existing) throw new Error("Correo ya registrado");

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.users.create({
    data: { 
      nombre: data.nombre,
      apellido: data.apellido,
      correo: data.correo,
      telefono: data.telefono,
      ubicacion: data.ubicacion,
      password: hashedPassword,
      role: roleFromLogic ?? Role.user // usa Role.user por defecto
    },
  });

  return user;
};

export const login = async (correo: string, password: string) => {
  const user = await prisma.users.findUnique({ where: { correo } });
  if (!user) throw new Error("Usuario no encontrado");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Contraseña incorrecta");

  const token = jwt.sign(
    {
      id: user.id,
      correo: user.correo,
      role: user.role,
      nombre: user.nombre,
      apellido: user.apellido,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "3h" }
  );

  return { user, token };
};
