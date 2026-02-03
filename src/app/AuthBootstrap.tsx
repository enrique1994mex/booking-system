"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/application/hooks";
import { setUser, getCurrentUser } from "@/application/slices/authSlice";
import { onAuthStateChangeService } from "@/application/services/AuthService";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 1. Rehydrate session on app load
    dispatch(getCurrentUser());

    // 2. Listen for auth state changes (login/logout in other tabs)
    const unsubscribe = onAuthStateChangeService((user) => {
      dispatch(setUser(user));
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
}
