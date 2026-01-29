"use client";

import { useState } from "react";
import type { Task } from "@/lib/types/task";
import { TaskStatus } from "@/lib/types/task-status";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Pencil, Trash2 } from "lucide-react";

const statusLabel: Record<string, string> = {
  [TaskStatus.PENDING]: "A fazer",
  [TaskStatus.IN_PROGRESS]: "Em progresso",
  [TaskStatus.COMPLETED]: "Concluído",
};

const statusBadgeClass: Record<string, string> = {
  [TaskStatus.PENDING]:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200",
  [TaskStatus.IN_PROGRESS]:
    "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200",
  [TaskStatus.COMPLETED]:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
};

type Props = {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  isDragging?: boolean;
  variant?: "list" | "default";
  className?: string;
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  isDragging,
  variant = "default",
  className,
}: Props) {
  const isList = variant === "list";
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function handleConfirmDelete() {
    onDelete?.(task);
    setDeleteDialogOpen(false);
  }

  return (
    <TooltipProvider>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <Card
        size="sm"
        className={cn(
          "cursor-grab active:cursor-grabbing transition-shadow",
          isList && 'shadow-none ring-0 border-0 bg-sky-50/90 rounded-lg dark:bg-sky-950/40',
          isDragging && "opacity-50 shadow-lg",
          className
        )}
      >
        <CardHeader
          className={cn(
            "flex flex-row items-start justify-between gap-2",
            isList && "px-3 py-2"
          )}
        >
          <CardTitle className="line-clamp-1 text-sm font-semibold">{task.title}</CardTitle>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 text-xs font-medium",
              statusBadgeClass[task.status] ?? "bg-muted text-muted-foreground"
            )}
          >
            {statusLabel[task.status] ?? task.status}
          </Badge>
        </CardHeader>
        <CardContent className={cn(isList && "px-3 py-0")}>
          <p
            className={cn(
              "text-muted-foreground",
              isList ? "line-clamp-1 text-xs" : "line-clamp-2 text-sm"
            )}
          >
            {task.description || "—"}
          </p>
        </CardContent>
        <CardFooter className={cn("flex items-center justify-between gap-2", isList && "px-3 py-2")}>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Tooltip>
              <TooltipTrigger className="hover:bg-sky-50/90" asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="h-7 w-7"
                  aria-label="Editar"
                  onClick={() => onEdit?.(task)}
                >
                  <Pencil className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Editar</TooltipContent>
            </Tooltip>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            aria-label="Excluir tarefa"
          >
            <Trash2 className="size-4" />
          </Button>
        </CardFooter>
      </Card>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir tarefa</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir &quot;{task.title}&quot;? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleConfirmDelete}>
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </TooltipProvider>
  );
};
