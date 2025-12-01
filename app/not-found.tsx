import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyLead } from "@/components/ui/typography";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <Search className="h-24 w-24 mx-auto text-muted-foreground" />
        <div className="space-y-2">
          <TypographyH1>Page Not Found</TypographyH1>
          <TypographyLead>
            The page you&apos;re looking for doesn&apos;t exist.
          </TypographyLead>
        </div>
        <Button asChild>
          <Link href="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
}
