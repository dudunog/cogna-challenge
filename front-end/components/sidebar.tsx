"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListTodo, LogOut, Search, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "To do list", icon: ListTodo },
];

const footerItems = [
  { href: "/logout", label: "Log out", icon: LogOut },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-background">
      <div className="flex flex-col gap-6 p-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <div className="flex size-8 items-center justify-center rounded-md bg-foreground text-background">
            <ListTodo className="size-4" />
          </div>
          Taskk
        </Link>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="h-9 bg-muted pl-8 pr-8"
            aria-label="Search"
          />
          <Mic className="absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto border-t border-border p-4">
        <nav className="flex flex-col gap-1">
          {footerItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
