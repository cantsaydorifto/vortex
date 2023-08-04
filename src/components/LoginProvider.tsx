"use client";
import useRefresh from "@/hooks/useRefresh";
import { useEffect, type ReactNode } from "react";

export default function LoginProvider({ children }: { children: ReactNode }) {
  const refresh = useRefresh();
  useEffect(() => {
    refresh();
  }, []);
  return <>{children}</>;
}
