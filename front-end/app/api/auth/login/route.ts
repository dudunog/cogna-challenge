import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api-server";

const TOKEN_COOKIE = "token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { message: "E-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }
    const res = await fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: String(email).trim(), password: String(password) }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message ?? "Credenciais inválidas" },
        { status: res.status }
      );
    }

    if (!data.access_token) {
      return NextResponse.json(
        { message: "Resposta inválida do servidor" },
        { status: 502 }
      );
    }

    const response = NextResponse.json({ user: data.user });
    response.cookies.set(TOKEN_COOKIE, data.access_token, COOKIE_OPTIONS);

    return response;
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Erro ao fazer login" },
      { status: 500 }
    );
  }
}
