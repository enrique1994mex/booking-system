"use client";
import { ReadonlyURLSearchParams } from "next/navigation";
import { AccommodationLayout } from "../layouts/AccommodationLayout";
import { useEffect } from "react";
import { useAppDispatch } from "@/application/hooks";
import { usePageLoading } from "@/application/hooks/usePageLoading";
import { getAccommodationAvailability } from "@/application/slices/accommodationSlice";
import { Accommodation } from "../components/Accommodation";
import { AccommodationSkeleton } from "../components/skeletons/AccommodationSkeleton";

interface Props {
  searchParams: ReadonlyURLSearchParams;
  id: string;
}

export function AccommodationPage({ searchParams, id }: Props) {
  const dispatch = useAppDispatch();
  const { isLoading } = usePageLoading((state) => state.accommodation.loading);

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
      {isLoading ? <AccommodationSkeleton /> : <Accommodation />}
    </AccommodationLayout>
  );
}