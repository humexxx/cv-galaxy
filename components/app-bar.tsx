"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { FileText, Settings } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { SearchBar } from "@/components/search-bar"
import { SearchDropdown } from "@/components/search-dropdown"
import { Button } from "@/components/ui/button"
import { searchCVs, getTopResults } from "@/data/cvs"
import { useDebounce } from "@/hooks/use-debounce"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AppBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [localSearchValue, setLocalSearchValue] = useState("")
  
  // Check if we're on a CV page (e.g., /humexxx)
  const isOnCVPage = pathname !== "/" && pathname !== "/settings" && !pathname.startsWith("/_")
  
  // Use query params on home page, local state on CV pages
  const searchValue = isOnCVPage ? localSearchValue : (searchParams.get("q") || "")
  const debouncedSearch = useDebounce(searchValue, 300)
  
  const isLoading = searchValue.trim() !== debouncedSearch.trim()
  
  // Search results for dropdown (only on CV pages)
  const searchResults = useMemo(() => {
    if (!isOnCVPage || !debouncedSearch.trim()) {
      return { top: [], all: [] }
    }
    const results = searchCVs(debouncedSearch)
    const top = getTopResults()
    
    return {
      top: debouncedSearch.trim() ? top : [],
      all: results
    }
  }, [isOnCVPage, debouncedSearch])

  const handleSearchChange = (value: string) => {
    if (isOnCVPage) {
      // On CV pages, just update local state (no navigation)
      setLocalSearchValue(value)
    } else {
      // On home page, update URL
      if (value.trim()) {
        router.push(`/?q=${encodeURIComponent(value)}`, { scroll: false })
      } else {
        router.push("/", { scroll: false })
      }
    }
  }
  
  const handleSelectResult = (username: string) => {
    setLocalSearchValue("")
    router.push(`/${username}`)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Logo and App Name */}
        <Link href="/" className="flex items-center gap-2 mr-4">
          <div className="flex items-center justify-center w-8 h-8 rounded border-2">
            <FileText className="h-5 w-5" />
          </div>
          <span className="font-semibold text-lg">CV Galaxy</span>
        </Link>
        
        {/* Search Bar - Centered */}
        <div className="flex-1 max-w-2xl mx-auto relative">
          <SearchBar 
            size="sm"
            inputClassName="bg-background"
            value={searchValue}
            onChange={handleSearchChange}
          />
          {isOnCVPage && searchValue.trim() && (
            <SearchDropdown
              topResults={searchResults.top}
              allResults={searchResults.all}
              isLoading={isLoading}
              onSelectResult={handleSelectResult}
            />
          )}
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-sm">
                Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Send Feedback</DialogTitle>
                <DialogDescription>
                  Let us know what you think! Your feedback helps us improve CV Galaxy.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="feedback">Your feedback</Label>
                  <textarea
                    id="feedback"
                    placeholder="Tell us what you think..."
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    placeholder="your@email.com"
                    type="email"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setFeedbackOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setFeedbackOpen(false)}>
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
