"use client";

import type { Task } from "@/lib/types/task";

import { cn } from "@/lib/utils";
import { TaskCard } from "@/components/task-card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  className?: string;
};

export function TaskListView({ tasks, onEdit, onDelete, className }: Props) {
  return (
    <ScrollArea className={cn("flex-1", className)}>
      <ul className="flex flex-col gap-2 pr-4">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} variant="list" />
          </li>
        ))}
      </ul>
      {tasks.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma tarefa ainda.</p>
      )}
    </ScrollArea>
  );
}
