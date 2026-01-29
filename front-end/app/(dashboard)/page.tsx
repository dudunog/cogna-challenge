"use client";

import type { Task } from "@/lib/types/task";
import type { TaskStatusValue } from "@/lib/types/task-status";

import { useState, useEffect, useCallback } from "react";
import { List, LayoutGrid } from "lucide-react";
import { toast } from "sonner";

import { fetchTasks } from "@/lib/api/fetch-tasks";
import { createTask } from "@/lib/api/create-task";
import { updateTask } from "@/lib/api/update-task";
import { deleteTask } from "@/lib/api/delete-task";

import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TaskListView } from "@/components/task-list-view";
import { KanbanView } from "@/components/kanban-view";
import { AddTaskDialog } from "@/components/add-task-dialog";

type ViewMode = "list" | "board";
type PeriodTab = "today" | "yesterday" | "week" | "month";

export default function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [period, setPeriod] = useState<PeriodTab>("today");
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTasks({ orderBy: "updatedAt", orderDirection: "desc" });
      setTasks(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao carregar tarefas");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = () => {
    setEditingTask(null);
    setAddTaskOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setAddTaskOpen(true);
  };

  const handleDialogSubmit = async (payload: {
    title: string;
    description?: string;
    status?: string;
  }) => {
    const data = {
      title: payload.title,
      description: payload.description,
      status: payload.status as TaskStatusValue | undefined,
    };
    if (editingTask) {
      await updateTask(editingTask.id, data);
      toast.success("Tarefa atualizada");
    } else {
      await createTask(data);
      toast.success("Tarefa criada");
    }
    await loadTasks();
  };

  const handleDeleteTask = async (task: Task) => {
    try {
      await deleteTask(task.id);
      toast.success("Tarefa excluída");
      await loadTasks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao excluir tarefa");
    }
  };

  const handleMoveTask = async (taskId: string, newStatus: string) => {
    try {
      await updateTask(taskId, { status: newStatus as TaskStatusValue });
      await loadTasks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao mover tarefa");
    }
  };

  return (
    <>
      <Header onAddTask={handleAddTask} />

      <div className="flex flex-1 flex-col overflow-hidden p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-foreground">Lista de tarefas</h1>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-border p-0.5">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className={cn("gap-1.5", viewMode === "list" && "bg-muted")}
                onClick={() => setViewMode("list")}
                aria-pressed={viewMode === "list"}
              >
                <List className="size-4" />
                Lista
              </Button>
              <Button
                variant={viewMode === "board" ? "secondary" : "ghost"}
                size="sm"
                className={cn("gap-1.5", viewMode === "board" && "bg-muted")}
                onClick={() => setViewMode("board")}
                aria-pressed={viewMode === "board"}
              >
                <LayoutGrid className="size-4" />
                Quadro
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={period} onValueChange={(v) => setPeriod(v as PeriodTab)} className="mb-6">
          <TabsList>
            <TabsTrigger value="today" className="w-full">Hoje</TabsTrigger>
            <TabsTrigger value="yesterday" className="w-full">Ontem</TabsTrigger>
            <TabsTrigger value="week" className="w-full">Semana</TabsTrigger>
            <TabsTrigger value="month" className="w-full">Mês</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="mt-0" />
          <TabsContent value="yesterday" className="mt-0" />
          <TabsContent value="week" className="mt-0" />
          <TabsContent value="month" className="mt-0" />
        </Tabs>

        <div className="flex-1 overflow-hidden">
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando tarefas…</p>
          ) : viewMode === "list" ? (
            <TaskListView
              tasks={tasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ) : (
            <KanbanView
              tasks={tasks}
              onMoveTask={handleMoveTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
        </div>
      </div>

      <AddTaskDialog
        open={addTaskOpen}
        onOpenChange={setAddTaskOpen}
        task={editingTask}
        onSubmit={handleDialogSubmit}
        onSuccess={loadTasks}
      />
    </>
  );
}
