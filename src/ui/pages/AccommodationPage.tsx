"use client";
import { ReadonlyURLSearchParams } from "next/navigation";
import { AccommodationLayout } from "../layouts/AccommodationLayout";
import { useEffect } from "react";
import { useAppDispatch } from "@/application/hooks";
import { getAccommodationAvailability } from "@/application/slices/accommodationSlice";
import { Accommodation } from "../components/Accommodation";

interface Props {
  searchParams: ReadonlyURLSearchParams;
  id: string;
}

export function AccommodationPage({ searchParams, id }: Props) {
  const dispatch = useAppDispatch();

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  
  useEffect(() => {
    if (!id || !from || !to) return;

    dispatch(getAccommodationAvailability({
      accommodationId: id,
      startDate: from,
      endDate: to,
    }));
  }, [dispatch, id, from, to]);
  
  return (
    <AccommodationLayout>
      <Accommodation />
    </AccommodationLayout>
  );
}