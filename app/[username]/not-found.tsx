"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyLead } from "@/components/ui/typography";
import { useAuth } from "@/components/auth-provider";

export default function NotFound() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  
  // Extract username from pathname (format: /username)
  const username = pathname.split("/")[1];
  const isOwnProfile = isAuthenticated && user?.username === username;

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <FileText className="h-24 w-24 mx-auto text-muted-foreground" />
        <div className="space-y-2">
          <TypographyH1>CV Not Found</TypographyH1>
          <TypographyLead>
            {isOwnProfile 
              ? "You haven't created your CV yet."
              : "The CV you're looking for doesn't exist in our system."}
          </TypographyLead>
        </div>
        <div className="flex gap-3 justify-center">
          {isOwnProfile && (
            <Button asChild>
              <Link href="/cv/new">
                <Plus className="mr-2 h-4 w-4" />
                Create My CV
              </Link>
            </Button>
          )}
          <Button variant={isOwnProfile ? "outline" : "default"} asChild>
            <Link href="/">Go Back Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
