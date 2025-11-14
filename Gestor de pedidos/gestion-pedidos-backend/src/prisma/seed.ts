import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin", 10);

  await prisma.users.upsert({
    where: { correo: "admin@gmail.com" },
    update: {},
    create: {
      nombre: "Super",
      apellido: "Administrador",
      correo: "admin@gmail.com",
      password: "admin",
      telefono: "0000000000",
      ubicacion: "Oficina Central",
      role: "admin",
    },
  });

  console.log("✅ Usuario admin creado o existente.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
