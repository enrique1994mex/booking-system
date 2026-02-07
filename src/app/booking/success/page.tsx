import { Suspense } from "react";
import BookingSuccessClient from "./BookingSuccessClient";

export const dynamic = "force-dynamic";

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<p>Loading payment confirmation…</p>}>
      <BookingSuccessClient />
    </Suspense>
  );
}
