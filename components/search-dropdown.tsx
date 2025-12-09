"use client"

import Link from "next/link"
import Image from "next/image"
import { User } from "lucide-react"
import type { CVSearchResult } from "@/types/cv"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SearchDropdownProps {
  topResults: CVSearchResult[]
  allResults: CVSearchResult[]
  isLoading: boolean
  onSelectResult: (username: string) => void
}

export function SearchDropdown({
  topResults,
  allResults,
  isLoading,
  onSelectResult,
}: SearchDropdownProps) {
  const hasResults = topResults.length > 0 || allResults.length > 0

  if (isLoading) {
    return (
      <div className="absolute top-full mt-1 w-full bg-popover border rounded-md shadow-lg z-50">
        <ScrollArea className="max-h-[500px]">
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3">Top Results</h3>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2].map((i) => (
                  <ResultCardSkeleton key={i} />
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">All Results</h3>
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <ResultRowSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    )
  }

  if (!hasResults) {
    return (
      <div className="absolute top-full mt-1 w-full bg-popover border rounded-md shadow-lg z-50">
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No results found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-full mt-1 w-full bg-popover border rounded-md shadow-lg z-50">
      <ScrollArea className="max-h-[500px]">
        <div className="p-4 space-y-4">
          {topResults.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Top Results</h3>
              <div className="grid grid-cols-2 gap-2">
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
              {topResults.length > 0 && <Separator />}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">All Results</h3>
                  <span className="text-xs text-muted-foreground">
                    {allResults.length} {allResults.length === 1 ? 'result' : 'results'}
                  </span>
                </div>
                <div className="space-y-1">
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
      </ScrollArea>
    </div>
  )
}

function ResultCard({ result, onClick }: { result: CVSearchResult; onClick: () => void }) {
  return (
    <Link
      href={`/${result.username}`}
      onClick={onClick}
      className="flex flex-col items-center justify-center p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-left w-full cursor-pointer"
    >
      {result.avatar ? (
        <Image
          src={result.avatar}
          alt={result.fullName}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover mb-2"
        />
      ) : (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted mb-2">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      <div className="text-center w-full">
        <p className="font-semibold text-xs truncate">{result.fullName}</p>
        <p className="text-[10px] text-muted-foreground truncate">{result.title}</p>
      </div>
    </Link>
  )
}

function ResultRow({ result, onClick }: { result: CVSearchResult; onClick: () => void }) {
  return (
    <Link
      href={`/${result.username}`}
      onClick={onClick}
      className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-accent transition-colors text-left cursor-pointer"
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
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted shrink-0">
          <User className="h-4 w-4 text-muted-foreground" />
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
    <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-card">
      <Skeleton className="w-10 h-10 rounded-full mb-2" />
      <Skeleton className="h-3 w-16 mb-1" />
      <Skeleton className="h-2 w-12" />
    </div>
  )
}

function ResultRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2">
      <Skeleton className="w-8 h-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-2 w-16" />
      </div>
    </div>
  )
}
