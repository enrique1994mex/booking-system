"use client";
import { Layout, Typography, Button, Flex, Space } from "antd";
import localFont from "next/font/local";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const geistSans = localFont({
  src: [
    {
      path: "../../../public/fonts/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Geist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: [
    {
      path: "../../../public/fonts/GeistMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
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
            background: "transparent",
            borderBottom: "1px solid #f0f0f0",
            padding: "0 24px",
          }}
          >
            <Flex justify="space-around" align="center">
              <Title level={3}>Travel Reservation System</Title>
              <Space>
                <Button type="link">Sign In</Button>
                <Button type="primary">Sign Up</Button>
              </Space>

            </Flex>
          </Header>
          <Content style={{ padding: "20px" }}>{children}</Content>
          <Footer style={{ textAlign: "center" }}>
            © 2024 Travel Reservation System. All rights reserved.
          </Footer>
        </Layout>
      </body>
    </html>
  );
}