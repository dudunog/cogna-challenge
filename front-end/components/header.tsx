"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, LogOut, Plus } from "lucide-react";

type User = { id: string; email: string; name: string };

function getInitials(name: string | null, email: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

type Props = {
  onAddTask?: () => void;
};

export function Header({ onAddTask }: Props) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: User | null) => {
        if (!cancelled && data) setUser(data);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = user?.name?.trim();
  const initials = getInitials(user?.name ?? null, user?.email ?? "U");

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-muted/50 px-6">
      <span className="text-sm text-muted-foreground">Lista de tarefas</span>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer" asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-foreground hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Menu do usuário"
            >
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span>{displayName}</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="py-2">
            <span className="px-2 text-xs text-muted-foreground">
              {user?.email}
            </span>
          </DropdownMenuContent>
        </DropdownMenu>
        {onAddTask != null && (
          <Button size="default" onClick={onAddTask} className={cn("gap-1.5")}>
            <Plus className="size-4" />
            Adicionar tarefa
          </Button>
        )}
      </div>
    </header>
  );
}
