"use client"

import Link from "next/link"
import Image from "next/image"
import { FileText, User } from "lucide-react"
import type { CVSearchResult } from "@/types/cv"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { TypographyH2, TypographyMuted } from "@/components/ui/typography"

interface SearchResultsProps {
  topResults: CVSearchResult[]
  allResults: CVSearchResult[]
  isLoading: boolean
  onSelectResult: (username: string) => void
}

export function SearchResults({
  topResults,
  allResults,
  isLoading,
  onSelectResult,
}: SearchResultsProps) {
  const hasResults = topResults.length > 0 || allResults.length > 0

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <TypographyH2 className="mb-6">Top Results</TypographyH2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <ResultCardSkeleton key={i} />
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <div className="flex items-center justify-between mb-6">
            <TypographyH2>All Results</TypographyH2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ResultRowSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!hasResults) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <TypographyMuted className="text-base">No results found</TypographyMuted>
          <TypographyMuted>Try a different search term</TypographyMuted>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {topResults.length > 0 && (
        <div>
          <TypographyH2 className="mb-6">Top Results</TypographyH2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topResults.map((result) => (
              <ResultCard
                key={result.username}
                result={result}
                onClick={() => onSelectResult(result.username)}
              />
            ))}
          </div>
        </div>
      )}
      
      {allResults.length > 0 && (
        <>
          <Separator />
          <div>
            <div className="flex items-center justify-between mb-6">
              <TypographyH2>All Results</TypographyH2>
              <TypographyMuted>
                {allResults.length} {allResults.length === 1 ? 'result' : 'results'}
              </TypographyMuted>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allResults.map((result) => (
                <ResultRow
                  key={result.username}
                  result={result}
                  onClick={() => onSelectResult(result.username)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ResultCard({ result, onClick }: { result: CVSearchResult; onClick: () => void }) {
  return (
    <Link
      href={`/${result.username}`}
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left w-full cursor-pointer"
    >
      {result.avatar ? (
        <Image
          src={result.avatar}
          alt={result.fullName}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover mb-2"
        />
      ) : (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-2">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      <div className="text-center w-full">
        <p className="font-semibold text-sm truncate">{result.fullName}</p>
        <p className="text-xs text-muted-foreground truncate">{result.title}</p>
      </div>
    </Link>
  )
}

function ResultRow({ result, onClick }: { result: CVSearchResult; onClick: () => void }) {
  return (
    <Link
      href={`/${result.username}`}
      onClick={onClick}
      className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left w-full cursor-pointer"
    >
      {result.avatar ? (
        <Image
          src={result.avatar}
          alt={result.fullName}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="flex items-center justify-center w-8 h-8 rounded bg-muted shrink-0">
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{result.fullName}</p>
        <p className="text-xs text-muted-foreground truncate">{result.title}</p>
      </div>
    </Link>
  )
}

function ResultCardSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card">
      <Skeleton className="w-12 h-12 rounded-full mb-2" />
      <Skeleton className="h-4 w-20 mb-1" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}

function ResultRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2">
      <Skeleton className="w-8 h-8 rounded shrink-0" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-3 w-12 shrink-0" />
    </div>
  )
}
