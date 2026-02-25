"use client";

import { Spin } from "antd";
import { useAppSelector } from "@/application/hooks";

export function GlobalLoader() {
  const loading = useAppSelector((state) => state.ui.bootstrapping);

  if (!loading) return null;

  return (
    <Spin fullscreen tip="Loading..." />
  );
}