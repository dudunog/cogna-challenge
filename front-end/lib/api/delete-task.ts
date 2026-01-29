import { apiFetch } from "./api-fetch";

export async function deleteTask(id: string): Promise<void> {
  const res = await apiFetch(`/tasks/${id}`, { method: "DELETE" });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message ?? "Falha ao excluir tarefa");
  }
}
