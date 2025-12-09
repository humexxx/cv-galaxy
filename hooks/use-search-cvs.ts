import { useState, useEffect } from "react";
import type { CVSearchResult } from "@/types/cv";

interface SearchResponse {
  results: CVSearchResult[];
  top: CVSearchResult[];
}

export function useSearchCVs(query: string) {
  const [data, setData] = useState<SearchResponse>({ results: [], top: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchResults() {
      if (!query.trim()) {
        // Fetch top results when no query
        try {
          setLoading(true);
          const response = await fetch("/api/search", {
            signal: controller.signal,
          });
          
          if (!response.ok) {
            throw new Error("Failed to fetch top results");
          }

          const data = await response.json();
          setData(data);
          setError(null);
        } catch (err) {
          if (err instanceof Error && err.name !== "AbortError") {
            setError(err);
          }
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to search CVs");
        }

        const data = await response.json();
        setData(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchResults();

    return () => {
      controller.abort();
    };
  }, [query]);

  return { data, loading, error };
}
