import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

// Headings
export const TypographyH1 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn("scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl", className)}
      {...props}
    />
  )
);
TypographyH1.displayName = "TypographyH1";

export const TypographyH2 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("scroll-m-20 text-3xl font-semibold tracking-tight", className)}
      {...props}
    />
  )
);
TypographyH2.displayName = "TypographyH2";

export const TypographyH3 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)}
      {...props}
    />
  )
);
TypographyH3.displayName = "TypographyH3";

export const TypographyH4 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)}
      {...props}
    />
  )
);
TypographyH4.displayName = "TypographyH4";

// Paragraph
export const TypographyP = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("leading-7 not-first:mt-6", className)}
      {...props}
    />
  )
);
TypographyP.displayName = "TypographyP";

// Lead text (larger paragraph)
export const TypographyLead = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-xl text-muted-foreground", className)}
      {...props}
    />
  )
);
TypographyLead.displayName = "TypographyLead";

// Large text
export const TypographyLarge = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
);
TypographyLarge.displayName = "TypographyLarge";

// Small text
export const TypographySmall = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <small
      ref={ref}
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  )
);
TypographySmall.displayName = "TypographySmall";

// Muted text
export const TypographyMuted = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
TypographyMuted.displayName = "TypographyMuted";

// Inline code
export const TypographyInlineCode = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )}
      {...props}
    />
  )
);
TypographyInlineCode.displayName = "TypographyInlineCode";

// List
export const TypographyList = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
      {...props}
    />
  )
);
TypographyList.displayName = "TypographyList";

// Blockquote
export const TypographyBlockquote = forwardRef<HTMLQuoteElement, HTMLAttributes<HTMLQuoteElement>>(
  ({ className, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  )
);
TypographyBlockquote.displayName = "TypographyBlockquote";
