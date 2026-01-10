"use client";

import { Layout } from "antd";

export function SearchLayout({ children }: { children: React.ReactNode }) {
  const { Content } = Layout;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content>{children}</Content>
    </Layout>
  );
}