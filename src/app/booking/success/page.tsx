"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookingSuccess } from "@/ui/components/BookingSuccess";
import { BookingConfirmation } from "@/domain/read-models/BookingConfirmation";
import { mapBookingResultVM } from "@/ui/mappers/mapBookingResultVM";
import { BookingResultVM } from "@/ui/models/BookingResultVM";

export default function BookingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  const [booking, setBooking] = useState<BookingResultVM | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      router.replace("/");
      return;
    }

    const fetchConfirmation = async () => {
      try {
        const res = await fetch(
          `/api/bookings/confirmation/${bookingId}`,
          { cache: "no-store" }
        );

        if (!res.ok) return;

        const data: BookingConfirmation = await res.json();

        if (data.status === "CONFIRMED") {
          setBooking(mapBookingResultVM(data));
          setLoading(false);
          clearInterval(interval);
        }
      } catch (e) {
        console.error("Failed to fetch confirmation", e);
      }
    };

    const interval = setInterval(fetchConfirmation, 4000);
    
    return () => clearInterval(interval);
  }, [bookingId, router]);

  if (loading) {
    return <p>Confirming your payment...</p>;
  }

  if (!booking) return null;

  return (
    <BookingSuccess
      booking={booking}
      onBackHome={() => router.replace("/")}
    />
  );
}
