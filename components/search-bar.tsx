"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  className?: string
  inputClassName?: string
  size?: "sm" | "md" | "lg"
  value?: string
  onChange?: (value: string) => void
}

export function SearchBar({ 
  placeholder = "Search a username or describe your idea...",
  className,
  inputClassName,
  size = "md",
  value,
  onChange
}: SearchBarProps) {
  const sizeClasses = {
    sm: "h-10 pl-9",
    md: "h-12 pl-10",
    lg: "h-14 pl-12"
  }

  const iconSizeClasses = {
    sm: "left-3 h-4 w-4",
    md: "left-3.5 h-4 w-4",
    lg: "left-4 h-5 w-5"
  }

  return (
    <div className={cn("w-full relative", className)}>
      <Search className={cn(
        "absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none",
        iconSizeClasses[size]
      )} />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(sizeClasses[size], inputClassName)}
      />
    </div>
  )
}
