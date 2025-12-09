"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
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

export function SearchProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Inicializar desde query params solo una vez
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "")
  const [isNavigating, setIsNavigating] = useState(false)
  const debouncedQuery = useDebounce(searchQuery, 300)
  
  const isHomePage = pathname === "/"
  const isSearching = searchQuery.trim() !== debouncedQuery.trim()
  
  // Buscar si hay query (excepto en páginas internas como /_next, etc)
  const shouldSearch = !pathname.startsWith("/_") && debouncedQuery.trim() !== ""
  
  const { data: searchData, loading: searchLoading } = useSearchCVs(
    shouldSearch ? debouncedQuery : ""
  )
  
  const isLoading = isSearching || searchLoading
  
  const searchResults = {
    top: debouncedQuery.trim() ? searchData.top : [],
    all: searchData.results
  }
  
  // Actualizar URL inmediatamente (solo en home page y cuando no estamos navegando)
  useEffect(() => {
    if (!isHomePage || isNavigating) return
    
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery)}`, { scroll: false })
    } else {
      router.push("/", { scroll: false })
    }
  }, [searchQuery, isHomePage, isNavigating, router])
  
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

  const startNavigation = () => {
    setIsNavigating(true)
  }

  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      debouncedQuery, 
      setSearchQuery,
      startNavigation,
      isSearching,
      searchResults,
      isLoading
    }}>
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
