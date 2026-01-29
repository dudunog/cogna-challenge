"use client";

import { useState, useCallback } from "react";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
};

export type AuthResult = { success: true } | { success: false; error: string };

const MIN_PASSWORD_LENGTH = 6;

export function useAuth() {
  const [isPending, setIsPending] = useState(false);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResult> => {
    const { email, password } = credentials;

    if (!email?.trim() || !password) {
      return { success: false, error: "E-mail e senha são obrigatórios" };
    }

    setIsPending(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.message ?? "Credenciais inválidas" };
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Falha ao entrar",
      };
    } finally {
      setIsPending(false);
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<AuthResult> => {
    const { name, email, password } = credentials;

    if (!name?.trim() || !email?.trim() || !password) {
      return { success: false, error: "Nome, e-mail e senha são obrigatórios" };
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return { success: false, error: "A senha deve ter pelo menos 6 caracteres" };
    }

    setIsPending(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.message ?? "Falha ao criar conta" };
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Falha ao cadastrar",
      };
    } finally {
      setIsPending(false);
    }
  }, []);

  return { login, register, isPending };
}
