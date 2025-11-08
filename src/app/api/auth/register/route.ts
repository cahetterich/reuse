// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
    }

    // Verifica se o email já está cadastrado
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado." }, { status: 400 });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Retorna sem expor a senha
    return NextResponse.json({
      message: "Usuário cadastrado com sucesso!",
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro no servidor." }, { status: 500 });
  }
}
