"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      .then(() => {
        router.replace("/login");
        router.refresh();
      })
      .catch(() => {
        router.replace("/login");
        router.refresh();
      });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">Saindo…</p>
    </div>
  );
}
