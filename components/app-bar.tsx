"use client"

import { Menu, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export function AppBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SideNav />
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <span className="font-semibold">CV Galaxy</span>
        </div>
        
        <div className="flex flex-1 items-center justify-end">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

function SideNav() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center gap-2 px-4">
        <FileText className="h-5 w-5" />
        <span className="font-semibold">CV Galaxy</span>
      </div>
      <nav className="flex flex-col gap-1">
        {/* Add navigation items here */}
      </nav>
    </div>
  )
}
