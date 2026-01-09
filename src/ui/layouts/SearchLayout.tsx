"use client";

import { Layout } from "antd";

export function SearchLayout({ children }: { children: React.ReactNode }) {
  const { Header, Content, Footer } = Layout;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header 
        style={{
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          padding: "0 24px",
          marginBottom: "16px",
        }}
      >
        Buscar habitaciones
      </Header>
      <Content>{children}</Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}