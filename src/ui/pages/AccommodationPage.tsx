"use client";

import { AccommodationLayout } from "../layouts/AccommodationLayout";
import { useEffect } from "react";
import { useAppDispatch } from "@/application/hooks";
import { getAccommodationAvailability } from "@/application/slices/accommodationSlice";
import { Accommodation } from "../components/Accommodation";

interface AccommodationPageProps {
  id: string;
}

export function AccommodationPage({ id }: AccommodationPageProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAccommodationAvailability({
      accommodationId: id,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  }, [dispatch, id]);
  
  return (
    <AccommodationLayout>
      <Accommodation />
    </AccommodationLayout>
  );
}