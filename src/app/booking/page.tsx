import { Suspense } from "react";
import BookingClient from "./BookingClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading booking...</div>}>
      <BookingClient />
    </Suspense>
  );
}