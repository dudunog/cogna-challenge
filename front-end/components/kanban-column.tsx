"use client";

import type { Task } from "@/lib/types/task";

import { useDraggable, useDroppable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import { TaskCard } from "@/components/task-card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ListChecks, Clock, CheckCircle } from "lucide-react";

const COLUMN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  PENDING: ListChecks,
  IN_PROGRESS: Clock,
  COMPLETED: CheckCircle,
};

type Props = {
  id: string;
  title: string;
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
};

export function KanbanColumn({ id, title, tasks, onEdit, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const Icon = COLUMN_ICONS[id] ?? ListChecks;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-lg border border-border bg-muted/30 transition-colors",
        isOver && "ring-2 ring-primary/50"
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
        <Icon className="size-4 text-muted-foreground" />
        <span className="font-medium text-foreground">{title}</span>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      <ScrollArea className="flex-1 min-h-[200px] max-h-[calc(100vh-280px)]">
        <div className="flex flex-col gap-3 p-3">
          {tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

function DraggableTaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
}
