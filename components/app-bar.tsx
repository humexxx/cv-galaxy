"use client"

import { useState } from "react"
import Link from "next/link"
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
import packageJson from "../package.json"

export function AppBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const { searchQuery, setSearchQuery, searchResults, isLoading } = useSearch()
  
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
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-14 sm:h-16 items-center gap-2 sm:gap-4 px-3 sm:px-6">
        {/* Logo and App Name */}
        <Link href="/" className="flex items-center gap-2 mr-2 sm:mr-4">
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded border-2">
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
          {!isHomePage && searchQuery.trim() && (
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
          <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm hidden sm:inline-flex">
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
          <div className="[&>button]:h-8 [&>button]:w-8 sm:[&>button]:h-10 sm:[&>button]:w-10">
            <ModeToggle />
          </div>
          {(isAuthenticated ? <UserMenu /> : <LoginButton />)}
        </div>
      </div>
    </header>
  )
}
