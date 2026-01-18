"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "@/application/hooks";
import { searchAvailableAccomodations } from "@/application/slices/searchSlice";
import { SearchForm } from "../components/SearchForm";
import { SearchResults } from "../components/SearchResults";
import { SearchLayout } from "../layouts/SearchLayout";

export function SearchPage() {
  const params = useSearchParams();
  const dispatch = useAppDispatch();

  const city = params.get("city");
  const country = params.get("country");
  const from = params.get("from");
  const to = params.get("to");

  useEffect(() => {
    if (!from || !to || (!city && !country)) return;

    dispatch(
      searchAvailableAccomodations({
        location: { city: city ?? "", country: country ?? "" },
        startDate: from,
        endDate: to,
      })
    );
  }, [city, country, from, to, dispatch]);

  return (
    <SearchLayout>
      <SearchForm />
      <SearchResults />
    </SearchLayout>
  );
}