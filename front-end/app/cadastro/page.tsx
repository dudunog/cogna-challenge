"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ListTodo } from "lucide-react";

const PASSWORD_HINT = "Mínimo de 6 caracteres";

export default function CadastroPage() {
  const router = useRouter();
  const { register, isPending } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit =
    name.trim() !== "" && email.trim() !== "" && password.length >= 6;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await register({ name, email, password });
    if (result.success) {
      toast.success("Conta criada. Faça login.");
      router.push("/login");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <Link
            href="/"
            className="mx-auto flex items-center gap-2 font-semibold text-foreground"
          >
            <div className="flex size-8 items-center justify-center rounded-md bg-foreground text-background">
              <ListTodo className="size-4" />
            </div>
            Taskk
          </Link>
          <CardTitle className="text-xl">Cadastro</CardTitle>
          <CardDescription>
            Crie sua conta para gerenciar suas tarefas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                autoComplete="name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                autoComplete="email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                autoComplete="new-password"
              />
              <p className="text-xs text-muted-foreground">{PASSWORD_HINT}</p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!canSubmit || isPending}
            >
              {isPending ? "Cadastrando…" : "Cadastrar"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
