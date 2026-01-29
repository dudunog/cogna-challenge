import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api-server";
import { getToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = getToken(request);
  if (!token) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const res = await fetchApi("/users/me", { token });
  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message ?? "Falha ao buscar usuário" },
      { status: res.status }
    );
  }

  return NextResponse.json(data);
}
