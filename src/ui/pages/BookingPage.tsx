"use client";
import { ReadonlyURLSearchParams } from "next/navigation";
import { BookingLayout } from "../layouts/BookingLayout";
import { Booking } from "../components/Booking";

interface Props {
  searchParams: ReadonlyURLSearchParams;
}

export function BookingPage({ searchParams }: Props) {

  const roomId = searchParams.get("roomId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  console.log({ roomId, from, to });
  return (
    <BookingLayout>
      <Booking />
    </BookingLayout>
  );
} 