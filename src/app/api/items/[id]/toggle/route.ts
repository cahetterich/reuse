// src/app/api/items/[id]/toggle/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const item = await prisma.item.findUnique({ where: { id: Number(id) } });

    if (!item) {
      return Response.json({ error: "Item não encontrado" }, { status: 404 });
    }

    const newIsActive = !item.isActive;
    const newStatus = newIsActive ? "disponível" : "indisponível";

    const updated = await prisma.item.update({
      where: { id: Number(id) },
      data: { isActive: newIsActive, status: newStatus },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Erro no TOGGLE:", error);
    return Response.json({ error: "Erro ao atualizar status" }, { status: 500 });
  }
}

