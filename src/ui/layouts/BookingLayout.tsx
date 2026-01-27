"use client";

import { Layout } from "antd";

export function BookingLayout({ children }: { children: React.ReactNode }) {
  const { Content } = Layout;

  return (
    <Layout>
      <Content>{children}</Content>
    </Layout>
  );
}