"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { BookingSuccess } from "@/ui/components/BookingSuccess";
import { BookingResultVM } from "@/ui/models/BookingResultVM";

export default function BookingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  const [booking, setBooking] = useState<BookingResultVM | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
  if (!bookingId) {
    router.replace("/");
    return;
  }

  const fetchBooking = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (error) {
      console.error("Failed to fetch booking:", error);
      return;
    }

    if (data.status === "CONFIRMED") {
      setBooking(data);
      setLoading(false);
      clearInterval(interval);
    }
  };

  const interval = setInterval(fetchBooking, 5000);

  fetchBooking(); // Initial call
  
  return () => clearInterval(interval); // Cleanup
}, [bookingId, router, supabase]);

  if (loading) {
    return <p>Confirming your payment...</p>;
  }

  if (!booking) {
    return null;
  }

  return (
    <BookingSuccess
      booking={booking}
      onBackHome={() => router.replace("/")}
    />
  );
}
