import type { Task } from "@/lib/types/task";
import type { TaskStatusValue } from "@/lib/types/task-status";

import { apiFetch } from "./api-fetch";

type UpdateTaskPayload = {
  title?: string;
  description?: string;
  status?: TaskStatusValue;
};

export async function updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
  const res = await apiFetch(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message ?? "Falha ao atualizar tarefa");
  }

  return res.json();
}
