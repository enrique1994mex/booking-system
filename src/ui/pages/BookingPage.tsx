"use client";
import { ReadonlyURLSearchParams } from "next/navigation";
import { BookingLayout } from "../layouts/BookingLayout";
import { useEffect } from "react";
import { useAppDispatch } from "@/application/hooks";
import { getRoomDetail } from "@/application/slices/bookingSlice";
import { Booking } from "../components/Booking";

interface Props {
  searchParams: ReadonlyURLSearchParams;
}

export function BookingPage({ searchParams }: Props) {
   const dispatch = useAppDispatch();

  const roomId = searchParams.get("roomId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  
  useEffect(() => {
    if (!roomId || !from || !to) return;
    dispatch(getRoomDetail({
      roomId,
      dateRange: { from, to },
    }));
  }, [dispatch, roomId, from, to]);
  
  return (
    <BookingLayout>
      <Booking />
    </BookingLayout>
  );
} 