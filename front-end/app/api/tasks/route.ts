import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api-server";
import { getToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = getToken(request);

  if (!token) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = new URLSearchParams();

  ["status", "orderBy", "orderDirection", "skip", "take"].forEach((key) => {
    const v = searchParams.get(key);
    if (v != null && v !== "") query.set(key, v);
  }); 

  const qs = query.toString();
  const path = qs ? `/tasks?${qs}` : "/tasks";

  const res = await fetchApi(path, { token });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message ?? "Falha ao buscar tarefas" },
      { status: res.status }
    );
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const token = getToken(request);

  if (!token) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const res = await fetchApi("/tasks", {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message ?? "Falha ao criar tarefa" },
      { status: res.status }
    );
  }

  return NextResponse.json(data);
}
