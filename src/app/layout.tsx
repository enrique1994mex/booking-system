import type { Metadata } from "next";
import { AntdRegistry } from "@/ui/theme/AntdRegistry";
import { ConfigProvider } from "antd";
import { antdTheme } from "@/ui/theme/antdTheme";
import { RootLayout } from "@/ui/layouts/RootLayout";
import { GlobalLoader } from "@/ui/components/GlobalLoader";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travel Reserveation System",
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
        <Providers>
          <GlobalLoader />
          <RootLayout>{children}</RootLayout>
        </Providers>
      </ConfigProvider>
    </AntdRegistry>
  );
}

