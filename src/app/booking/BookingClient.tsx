"use client";
import { useSearchParams } from "next/navigation";
import { BookingPage } from "@/ui/pages/BookingPage";

export default function BookingClient() {
  const searchParams = useSearchParams();

  return <BookingPage searchParams={searchParams} />;
}