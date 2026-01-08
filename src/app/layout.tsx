import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { antdTheme } from "@/ui/theme/antdTheme";
import { RootLayout } from "@/ui/layouts/RootLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Airbnb Clone",
  description: "Booking platform",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={antdTheme}>
        <RootLayout>{children}</RootLayout>
      </ConfigProvider>
    </AntdRegistry>
  );
}

