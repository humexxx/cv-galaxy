"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { CVHighlight } from "@/types/chat";

interface HighlightContextType {
  highlights: CVHighlight[];
  addHighlight: (highlight: CVHighlight) => void;
  clearHighlights: () => void;
}

const HighlightContext = createContext<HighlightContextType>({
  highlights: [],
  addHighlight: () => {},
  clearHighlights: () => {},
});

export function CVHighlightProvider({ children }: { children: React.ReactNode }) {
  const [highlights, setHighlights] = useState<CVHighlight[]>([]);

  const addHighlight = useCallback((highlight: CVHighlight) => {
    setHighlights((prev) => {
      const exists = prev.some(h => h.text === highlight.text);
      if (exists) return prev;
      return [...prev, highlight];
    });
  }, []);

  const clearHighlights = useCallback(() => {
    setHighlights([]);
  }, []);

  return (
    <HighlightContext.Provider value={{ highlights, addHighlight, clearHighlights }}>
      {children}
    </HighlightContext.Provider>
  );
}

export const useHighlights = () => useContext(HighlightContext);
