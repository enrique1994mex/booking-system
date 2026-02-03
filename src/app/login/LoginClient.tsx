"use client";

import { useSearchParams } from "next/navigation";
import { LoginPage } from "@/ui/pages/LoginPage";

export function LoginClient() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  return <LoginPage redirectTo={redirectTo} />;
}
