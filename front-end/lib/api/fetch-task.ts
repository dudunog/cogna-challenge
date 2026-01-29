import type { Task } from "@/lib/types/task";
import { apiFetch } from "./api-fetch";

export async function fetchTask(id: string): Promise<Task | null> {
  const res = await apiFetch(`/tasks/${id}`);

  if (res.status === 404) return null;

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message ?? "Falha ao buscar tarefa");
  }

  return res.json();
}
