"use client";

import { useSearchParams, useParams } from "next/navigation";
import { AccommodationPage } from "@/ui/pages/AccommodationPage";

export default function AccommodationClient() {
  const searchParams = useSearchParams();
  const params = useParams();

  const id = params.id as string;

  return <AccommodationPage searchParams={searchParams} id={id}/>
}