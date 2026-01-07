import type { Metadata } from "next";
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
    <RootLayout>
      {children}
    </RootLayout>
  );
}

