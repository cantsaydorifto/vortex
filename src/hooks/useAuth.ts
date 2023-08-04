"use client";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx;
}
