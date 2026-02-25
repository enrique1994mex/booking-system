"use client";
import { ReadonlyURLSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "@/application/hooks";
import { usePageLoading } from "@/application/hooks/usePageLoading";
import { searchAvailableAccomodations } from "@/application/slices/searchSlice";
import { SearchForm } from "../components/SearchForm";
import { SearchResults } from "../components/SearchResults";
import { SearchResultsSkeleton } from "../components/skeletons/SearchResultsSkeleton";
import { SearchLayout } from "../layouts/SearchLayout";

interface Props {
  searchParams: ReadonlyURLSearchParams;
}

export function SearchPage({ searchParams }: Props) {
  const dispatch = useAppDispatch();
  const { isLoading } = usePageLoading((state) => state.search.loading);

  const city = searchParams.get("city");
  const country = searchParams.get("country");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

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
      {isLoading ? <SearchResultsSkeleton /> : <SearchResults />}
    </SearchLayout>
  );
}