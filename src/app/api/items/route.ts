// src/app/api/items/route.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET 
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const items = await prisma.item.findMany({
    where: userId ? { userId: Number(userId) } : {},
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(items);
}

// POST 
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { title, description, category, price, imageUrl, userId } = data;

    if (!title || !description || !category || !userId) {
      return Response.json(
        { error: "Campos obrigatórios faltando." },
        { status: 400 }
      );
    }

    const newItem = await prisma.item.create({
      data: {
        title,
        description,
        category,
        price: price ? Number(price) : null,
        imageUrl: imageUrl || null,
        userId: Number(userId),
        // status e isActive já possuem default
      },
    });

    return Response.json(newItem);
  } catch (error) {
    console.error("Erro ao criar item:", error);
    return Response.json({ error: "Erro no servidor" }, { status: 500 });
  }
}

