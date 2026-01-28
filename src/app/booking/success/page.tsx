"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/application/hooks";
import { clearBooking } from "@/application/slices/bookingSlice";
import { BookingSuccess } from "@/ui/components/BookingSuccess";

export default function BookingSuccessPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { result, status } = useAppSelector((state) => state.booking);

  if (status !== "confirmed" || !result) {
    return null; // o redirect luego
  }

  const handleBackHome = () => {
    dispatch(clearBooking());
    router.replace("/");
  };

  return (
    <BookingSuccess
      booking={result}
      onBackHome={handleBackHome}
    />
  );
}
