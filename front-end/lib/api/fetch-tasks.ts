import type { Task } from "@/lib/types/task";
import type { TaskStatusValue } from "@/lib/types/task-status";

import { apiFetch } from "./api-fetch";

export async function fetchTasks(params?: {
  status?: TaskStatusValue;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  skip?: number;
  take?: number;
}): Promise<Task[]> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.orderBy) searchParams.set("orderBy", params.orderBy);
  if (params?.orderDirection) searchParams.set("orderDirection", params.orderDirection);
  if (params?.skip != null) searchParams.set("skip", String(params.skip));
  if (params?.take != null) searchParams.set("take", String(params.take));

  const qs = searchParams.toString();
  const path = qs ? `/tasks?${qs}` : "/tasks";
  const res = await apiFetch(path);

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message ?? "Falha ao buscar tarefas");
  }

  return res.json();
}
