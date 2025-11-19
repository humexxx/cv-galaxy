"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FileText, Settings } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
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
  const searchParams = useSearchParams()
  const searchValue = searchParams.get("q") || ""
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  const handleSearchChange = (value: string) => {
    if (value.trim()) {
      router.push(`/?q=${encodeURIComponent(value)}`, { scroll: false })
    } else {
      router.push("/", { scroll: false })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Logo and App Name */}
        <Link href="/" className="flex items-center gap-2 mr-4">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">CV Galaxy</span>
        </Link>
        
        {/* Search Bar - Centered */}
        <div className="flex-1 max-w-2xl mx-auto">
          <SearchBar 
            size="sm"
            inputClassName="bg-background"
            value={searchValue}
            onChange={handleSearchChange}
          />
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
