"use client";
import { Layout } from "antd";
import { Geist, Geist_Mono } from "next/font/google";

const { Header, Content, Footer } = Layout;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Layout 
          style={{ minHeight: "100vh" }}
          className={`${geistSans.variable} ${geistMono.variable}`}
        >
          <Header
            style={{
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            padding: "0 24px",
          }}
          >
            Airbnb Clone
          </Header>
          <Content style={{ padding: "20px" }}>{children}</Content>
          <Footer style={{ textAlign: "center" }}>
            © 2024 Airbnb Clone. All rights reserved.
          </Footer>
        </Layout>
      </body>
    </html>
  );
}