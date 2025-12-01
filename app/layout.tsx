import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AppBar } from "@/components/app-bar";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CV Galaxy",
    template: "%s | CV Galaxy",
  },
  description: "Discover and share professional CVs in CV Galaxy - A modern platform to showcase your career, skills, and experience.",
  keywords: ["CV", "resume", "portfolio", "career", "professional", "developer"],
  authors: [{ name: "CV Galaxy" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cv-galaxy.vercel.app",
    siteName: "CV Galaxy",
    title: "CV Galaxy",
    description: "Discover and share professional CVs in CV Galaxy",
  },
  twitter: {
    card: "summary",
    title: "CV Galaxy",
    description: "Discover and share professional CVs in CV Galaxy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Suspense fallback={
              <header className="sticky top-0 z-50 w-full border-b bg-background h-16" />
            }>
              <AppBar />
            </Suspense>
            <main className="flex-1">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
