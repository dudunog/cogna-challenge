import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nome, e-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { message: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    const res = await fetchApi("/users", {
      method: "POST",
      body: JSON.stringify({
        name: String(name).trim(),
        email: String(email).trim(),
        password: String(password),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message ?? "Falha ao criar conta" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Erro ao cadastrar" },
      { status: 500 }
    );
  }
}
