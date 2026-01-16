"use client";

import { AccommodationLayout } from "../layouts/AccommodationLayout";

interface AccommodationPageProps {
  id: string;
}

export function AccommodationPage({ id }: AccommodationPageProps) {
  return (
    <AccommodationLayout>
      <div>{id}</div>
    </AccommodationLayout>
  );
}