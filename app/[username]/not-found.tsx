import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <FileText className="h-24 w-24 mx-auto text-muted-foreground" />
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">CV Not Found</h1>
          <p className="text-muted-foreground text-lg">
            The CV you&apos;re looking for doesn&apos;t exist in our system.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
}
