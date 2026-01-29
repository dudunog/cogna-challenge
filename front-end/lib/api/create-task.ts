import type { TaskStatusValue } from "@/lib/types/task-status";
import type { Task } from "@/lib/types/task";

import { apiFetch } from "./api-fetch";

type CreateTaskPayload = {
  title: string;
  description?: string;
  status?: TaskStatusValue;
};

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const res = await apiFetch("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message ?? "Falha ao criar tarefa");
  }

  return res.json();
}
