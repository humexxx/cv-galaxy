"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { SearchResults } from "@/components/search-results";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchCVs } from "@/hooks/use-search-cvs";
import { Suspense } from "react";
import { TypographyH2, TypographyMuted } from "@/components/ui/typography";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const debouncedQuery = useDebounce(queryParam, 300);

  const { data: searchData, loading: searchLoading } = useSearchCVs(debouncedQuery);
  const isLoading = queryParam.trim() !== debouncedQuery.trim() || searchLoading;

  const searchResults = {
    top: searchData.top,
    all: searchData.results,
    loading: isLoading
  };

  const handleSelectResult = (username: string) => {
    router.push(`/${username}`);
  };

  const hasQuery = queryParam.trim().length > 0;

  return (
    <div className="flex-1 flex flex-col">
      {!hasQuery ? (
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-12rem)]">
          <div className="container mx-auto max-w-2xl px-6">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <TypographyH2>Begin your search</TypographyH2>
                <TypographyMuted className="max-w-xs">
                  Use the search bar above to find CVs by name, title, skills, or keywords.
                </TypographyMuted>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto p-6 max-w-7xl">
          <SearchResults
            topResults={searchResults.top}
            allResults={searchResults.all}
            isLoading={isLoading}
            onSelectResult={handleSelectResult}
          />
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
