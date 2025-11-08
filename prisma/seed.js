// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Senha padrão para todos os usuários
  const password = await bcrypt.hash("123456", 10);

  // Criando usuários (upsert evita duplicados)
  const joao = await prisma.user.upsert({
    where: { email: "joao@reuse.com" },
    update: {},
    create: {
      name: "João Silva",
      email: "joao@reuse.com",
      password,
    },
  });

  const maria = await prisma.user.upsert({
    where: { email: "maria@reuse.com" },
    update: {},
    create: {
      name: "Maria Lima",
      email: "maria@reuse.com",
      password,
    },
  });

  // Itens do João
  await prisma.item.createMany({
    data: [
      {
        title: "Celular usado",
        description: "Smartphone em bom estado, apenas com alguns riscos.",
        category: "Eletrônicos",
        price: 450.0,
        imageUrl: "https://via.placeholder.com/300x200?text=Celular",
        status: "disponível",
        isActive: true,
        userId: joao.id,
      },
      {
        title: "Camiseta esportiva",
        description: "Camiseta tamanho M, quase nova.",
        category: "Roupas",
        price: 30.0,
        imageUrl: "https://via.placeholder.com/300x200?text=Camiseta",
        status: "trocado",
        isActive: false,
        userId: joao.id,
      },
    ],
    skipDuplicates: true,
  });

  // Itens da Maria
  await prisma.item.createMany({
    data: [
      {
        title: "Livros de programação",
        description: "Coleção de livros sobre JavaScript e Node.js.",
        category: "Livros",
        price: 120.0,
        imageUrl: "https://via.placeholder.com/300x200?text=Livros",
        status: "disponível",
        isActive: true,
        userId: maria.id,
      },
      {
        title: "Mesa de escritório",
        description: "Mesa compacta de madeira, ideal para home office.",
        category: "Móveis",
        price: 250.0,
        imageUrl: "https://via.placeholder.com/300x200?text=Mesa",
        status: "disponível",
        isActive: true,
        userId: maria.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Usuários e itens criados com sucesso!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
