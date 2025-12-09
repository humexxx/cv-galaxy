"use client"

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { SearchResults } from "@/components/search-results";
import { useSearch } from "@/components/search-provider";
import { TypographyH2, TypographyMuted } from "@/components/ui/typography";

export default function Home() {
  const router = useRouter();
  const { searchQuery, searchResults, isLoading, startNavigation } = useSearch();

  const handleSelectResult = (username: string) => {
    startNavigation();
    router.push(`/${username}`);
  };

  const hasQuery = searchQuery.trim().length > 0;

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


