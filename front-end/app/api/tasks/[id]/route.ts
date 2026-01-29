import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api-server";
import { getToken } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getToken(request);
  if (!token) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  const res = await fetchApi(`/tasks/${id}`, { token });

  if (res.status === 404) {
    return NextResponse.json({ message: "Tarefa não encontrada" }, { status: 404 });
  }

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message ?? "Falha ao buscar tarefa" },
      { status: res.status }
    );
  }
  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getToken(request);

  if (!token) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  const body = await request.json();

  const res = await fetchApi(`/tasks/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message ?? "Falha ao atualizar tarefa" },
      { status: res.status }
    );
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getToken(request);

  if (!token) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  const res = await fetchApi(`/tasks/${id}`, { method: "DELETE", token });

  if (!res.ok) {
    const data = await res.json();

    return NextResponse.json(
      { message: data.message ?? "Falha ao excluir tarefa" },
      { status: res.status }
    );
  }

  return new NextResponse(null, { status: 204 });
}
