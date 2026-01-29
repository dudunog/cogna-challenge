import type { NextRequest } from "next/server";

export function getToken(request: NextRequest): string | undefined {
  return request.cookies.get("token")?.value;
}
