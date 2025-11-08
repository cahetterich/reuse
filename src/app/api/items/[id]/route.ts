// src/app/api/items/[id]/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET → buscar item por id
export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ agora com await

  const item = await prisma.item.findUnique({
    where: { id: Number(id) },
  });

  if (!item) {
    return Response.json({ error: "Item não encontrado" }, { status: 404 });
  }

  return Response.json(item);
}

// PUT → atualizar item
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ await aqui também
    const body = await req.json();
    const { title, description, category, price, imageUrl, status } = body;

    const updatedItem = await prisma.item.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        category,
        price: price ? Number(price) : null,
        imageUrl: imageUrl || null,
        status: status || "disponível",
      },
    });

    return Response.json(updatedItem);
  } catch (error) {
    console.error("Erro no PUT:", error);
    return Response.json({ error: "Erro ao atualizar item" }, { status: 500 });
  }
}

// DELETE → remover item
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ await também
    await prisma.item.delete({
      where: { id: Number(id) },
    });
    return Response.json({ message: "Item removido com sucesso" });
  } catch (error) {
    console.error("Erro no DELETE:", error);
    return Response.json({ error: "Erro ao deletar item" }, { status: 500 });
  }
}


