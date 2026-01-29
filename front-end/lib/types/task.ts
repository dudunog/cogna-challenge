import type { TaskStatusValue } from "./task-status";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatusValue;
  createdAt: string;
  updatedAt: string;
  userId: string;
};
