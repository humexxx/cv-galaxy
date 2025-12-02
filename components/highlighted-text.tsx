"use client";

import { useHighlights } from "./cv-highlight-provider";

interface HighlightedTextProps {
  text: string;
}

export function HighlightedText({ text }: HighlightedTextProps) {
  const { highlights } = useHighlights();

  if (highlights.length === 0 || !text) return <>{text}</>;

  const matches: Array<{ start: number; end: number; color: string }> = [];

  for (const highlight of highlights) {
    const highlightText = highlight.text.toLowerCase();
    
    // Use word boundary regex to avoid partial matches (e.g., "ai" in "maintain")
    // Escape special regex characters in the highlight text
    const escapedHighlight = highlightText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedHighlight}\\b`, 'gi');
    let match;

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        color: highlight.color || "yellow",
      });
    }
  }

  if (matches.length === 0) return <>{text}</>;

  matches.sort((a, b) => a.start - b.start);

  const mergedMatches: typeof matches = [];
  for (const match of matches) {
    if (mergedMatches.length === 0) {
      mergedMatches.push(match);
      continue;
    }

    const last = mergedMatches[mergedMatches.length - 1];
    if (match.start <= last.end) {
      last.end = Math.max(last.end, match.end);
    } else {
      mergedMatches.push(match);
    }
  }

  const result: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of mergedMatches) {
    if (match.start > lastIndex) {
      result.push(text.slice(lastIndex, match.start));
    }

    const colorClasses = {
      yellow: "bg-yellow-200 text-yellow-900 dark:bg-yellow-400/40 dark:text-yellow-50",
      blue: "bg-blue-200 text-blue-900 dark:bg-blue-400/40 dark:text-blue-50",
      green: "bg-green-200 text-green-900 dark:bg-green-400/40 dark:text-green-50",
      purple: "bg-purple-200 text-purple-900 dark:bg-purple-400/40 dark:text-purple-50",
    };

    result.push(
      <mark
        key={match.start}
        className={`${colorClasses[match.color as keyof typeof colorClasses]} px-0.5 rounded transition-all duration-500 animate-pulse animation-duration-[3s]`}
      >
        {text.slice(match.start, match.end)}
      </mark>
    );

    lastIndex = match.end;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return <>{result}</>;
}
