"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"
import { useRouter, usePathname } from "next/navigation"
import { FileText } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { SearchBar } from "@/components/search-bar"
import { SearchDropdown } from "@/components/search-dropdown"
import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/login-button"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/components/auth-provider"
import { useSearch } from "@/components/search-provider"
import packageJson from "../package.json"

// No feedback backend exists, so the dialog that used to sit here silently
// discarded everything typed into it. A mailto: link actually delivers.
const FEEDBACK_EMAIL = "jahume92@gmail.com"
const FEEDBACK_MAILTO = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
  `CV Galaxy feedback (v${packageJson.version})`
)}&body=${encodeURIComponent(
  "What's working, what isn't, what you'd like to see:\n\n"
)}`

const subscribeNoop = () => () => {}

export function AppBar() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const { searchQuery, setSearchQuery, searchResults, isLoading } = useSearch()

  // This header hydrates inside a Suspense boundary, so by the time React gets
  // to it the auth context may already have resolved — reading it during that
  // first pass renders a button the server HTML doesn't have. React uses the
  // server snapshot for the whole hydration pass, so the trees match and the
  // swap only happens once hydration is done.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false)

  const isHomePage = pathname === "/"

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    // El provider se encarga de actualizar la URL en home page
  }
  
  const handleSelectResult = (username: string) => {
    setSearchQuery("")
    router.push(`/${username}`)
  }

  return (
    <header className="ios-material sticky top-0 z-50 w-full border-b border-border/60">
      <div className="flex h-14 sm:h-16 items-center gap-2 sm:gap-4 px-3 sm:px-6">
        {/* Logo and App Name */}
        <Link href="/" className="flex items-center gap-2 mr-2 sm:mr-4">
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-[9px] bg-primary text-primary-foreground shadow-[var(--shadow-ios)]">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="hidden sm:flex items-baseline gap-2">
            <span className="font-semibold text-base sm:text-lg">CV Galaxy</span>
            <span className="text-xs text-muted-foreground">v{packageJson.version}</span>
          </div>
        </Link>
        
        {/* Search Bar - Centered */}
        <div className="flex-1 max-w-2xl mx-auto relative">
          <SearchBar 
            size="sm"
            inputClassName="bg-background"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {!isHomePage && searchQuery.trim() !== "" && (
            <SearchDropdown
              topResults={searchResults.top}
              allResults={searchResults.all}
              isLoading={isLoading}
              onSelectResult={handleSelectResult}
            />
          )}
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs sm:text-sm hidden sm:inline-flex"
          >
            <a href={FEEDBACK_MAILTO}>Feedback</a>
          </Button>
          <div className="[&>button]:h-8 [&>button]:w-8 sm:[&>button]:h-10 sm:[&>button]:w-10">
            <ModeToggle />
          </div>
          {mounted && !isAuthLoading ? (
            isAuthenticated ? <UserMenu /> : <LoginButton />
          ) : (
            <div className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden />
          )}
        </div>
      </div>
    </header>
  )
}
