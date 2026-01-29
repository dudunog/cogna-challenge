"use client";

import type { Task } from "@/lib/types/task";
import { TaskStatus } from "@/lib/types/task-status";

import { useCallback, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import { TaskCard } from "@/components/task-card";
import { KanbanColumn } from "@/components/kanban-column";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const COLUMNS: { id: string; label: string }[] = [
  { id: TaskStatus.PENDING, label: "A fazer" },
  { id: TaskStatus.IN_PROGRESS, label: "Em progresso" },
  { id: TaskStatus.COMPLETED, label: "Concluído" },
];

type Props = {
  tasks: Task[];
  onMoveTask: (taskId: string, newStatus: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  className?: string;
};

function getTasksByStatus(tasks: Task[]) {
  const byStatus: Record<string, Task[]> = {
    [TaskStatus.PENDING]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.COMPLETED]: [],
  };
  for (const task of tasks) {
    if (byStatus[task.status]) byStatus[task.status].push(task);
  }
  return byStatus;
}

export function KanbanView({
  tasks,
  onMoveTask,
  onEdit,
  onDelete,
  className,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const taskId = String(active.id);
      const newStatus = String(over.id);
      if (COLUMNS.some((c) => c.id === newStatus)) {
        onMoveTask(taskId, newStatus);
      }
    },
    [onMoveTask]
  );

  const byStatus = getTasksByStatus(tasks);
  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <ScrollArea className={cn("flex-1", className)}>
        <div className="flex gap-4 pb-4 min-w-max">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.label}
              tasks={byStatus[col.id] ?? []}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <DragOverlay>
        {activeTask ? (
          <div className="w-72 rotate-1 opacity-95 shadow-lg">
            <TaskCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
