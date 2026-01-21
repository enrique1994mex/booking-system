"use client";

import { useSearchParams } from "next/navigation";
import { SearchPage } from "@/ui/pages/SearchPage";

export default function SearchClient() {
  const searchParams = useSearchParams();

  return <SearchPage searchParams={searchParams} />;
}
