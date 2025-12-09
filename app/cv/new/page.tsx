"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyLead } from "@/components/ui/typography";
import { Loader2, FileText } from "lucide-react";

export default function NewCVPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <TypographyH1>Create Your CV</TypographyH1>
          <TypographyLead>
            Start building your professional CV
          </TypographyLead>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              CV Builder (Coming Soon)
            </CardTitle>
            <CardDescription>
              This feature is currently under development. You&apos;ll soon be able to create and edit your CV directly from here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                For now, CVs need to be added directly to the database.
              </p>
              <p className="text-sm text-muted-foreground">
                Contact your administrator to set up your CV.
              </p>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={() => router.push("/")}>
                Go Back Home
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Profile Information</CardTitle>
            <CardDescription>
              This information will be used when creating your CV
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="font-medium text-muted-foreground">Name:</div>
              <div className="col-span-2">{user.fullName}</div>
              
              <div className="font-medium text-muted-foreground">Email:</div>
              <div className="col-span-2">{user.email}</div>
              
              <div className="font-medium text-muted-foreground">Username:</div>
              <div className="col-span-2">{user.username || "Not set"}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
