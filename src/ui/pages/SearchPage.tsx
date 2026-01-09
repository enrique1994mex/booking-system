"use client";

import { SearchForm } from "../components/SearchForm";
import { SearchResults } from "../components/SearchResults";
import { SearchLayout } from "../layouts/SearchLayout";

export function SearchPage() {
  return (
    <SearchLayout>
      <SearchForm />
      <SearchResults />
    </SearchLayout>
  );
}