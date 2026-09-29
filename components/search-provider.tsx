"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
  Suspense,
} from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import { useSearchCVs } from "@/hooks/use-search-cvs"
import type { CVSearchResult } from "@/types/cv"

interface SearchContextType {
  searchQuery: string
  debouncedQuery: string
  setSearchQuery: (query: string) => void
  startNavigation: () => void
  isSearching: boolean
  searchResults: {
    top: CVSearchResult[]
    all: CVSearchResult[]
  }
  isLoading: boolean
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

/**
 * Reads the initial `?q=` exactly once and hands it to the provider.
 *
 * `useSearchParams()` forces a Suspense boundary during static rendering, so it
 * lives here — in a component that renders nothing — instead of in the provider
 * itself. That keeps the boundary off `{children}`: the app subtree is rendered
 * once, by one owner, with one context value.
 */
function InitialSearchParams({ onRead }: { onRead: (query: string) => void }) {
  const searchParams = useSearchParams()
  const hasRead = useRef(false)

  useEffect(() => {
    if (hasRead.current) return
    hasRead.current = true
    onRead(searchParams.get("q") ?? "")
  }, [searchParams, onRead])

  return null
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [isNavigating, setIsNavigating] = useState(false)
  // Until the initial `?q=` has been read we must not write the URL, or we'd
  // clobber a deep-linked query before it is applied to state.
  const [didReadInitialQuery, setDidReadInitialQuery] = useState(false)
  const debouncedQuery = useDebounce(searchQuery, 300)

  const isHomePage = pathname === "/"
  const isSearching = searchQuery.trim() !== debouncedQuery.trim()

  // Buscar si hay query (excepto en páginas internas como /_next, etc)
  const shouldSearch = !pathname.startsWith("/_") && debouncedQuery.trim() !== ""

  const { data: searchData, loading: searchLoading } = useSearchCVs(
    shouldSearch ? debouncedQuery : ""
  )

  const isLoading = isSearching || searchLoading

  const handleInitialQuery = useCallback((query: string) => {
    // Don't stomp on anything the user already typed while the boundary resolved.
    setSearchQuery((current) => current || query)
    setDidReadInitialQuery(true)
  }, [])

  // Sync the URL from the *debounced* query with `replace`, so the history
  // stack doesn't get one entry per keystroke.
  useEffect(() => {
    if (!didReadInitialQuery || !isHomePage || isNavigating) return

    const currentQuery =
      new URLSearchParams(window.location.search).get("q") ?? ""
    const nextQuery = debouncedQuery.trim()

    if (currentQuery === nextQuery) return

    router.replace(
      nextQuery ? `/?q=${encodeURIComponent(nextQuery)}` : "/",
      { scroll: false }
    )
  }, [debouncedQuery, didReadInitialQuery, isHomePage, isNavigating, router])

  // Limpiar query y reset flag cuando sales de home page
  useEffect(() => {
    if (!isHomePage) {
      // Usar queueMicrotask para evitar setState síncrono
      queueMicrotask(() => {
        setSearchQuery("")
        setIsNavigating(false)
      })
    }
  }, [isHomePage])

  const startNavigation = useCallback(() => {
    setIsNavigating(true)
  }, [])

  const value = useMemo<SearchContextType>(
    () => ({
      searchQuery,
      debouncedQuery,
      setSearchQuery,
      startNavigation,
      isSearching,
      searchResults: {
        top: debouncedQuery.trim() ? searchData.top : [],
        all: searchData.results,
      },
      isLoading,
    }),
    [
      searchQuery,
      debouncedQuery,
      startNavigation,
      isSearching,
      searchData,
      isLoading,
    ]
  )

  return (
    <SearchContext.Provider value={value}>
      <Suspense fallback={null}>
        <InitialSearchParams onRead={handleInitialQuery} />
      </Suspense>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
