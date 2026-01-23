import { Suspense } from "react";
import AccommodationClient from "./AccommodationClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <AccommodationClient />
    </Suspense>
  );
}