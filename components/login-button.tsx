"use client";

import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { TypographyMuted } from "./ui/typography";

export function LoginButton() {
  const { signInWithLinkedIn } = useAuth();

  return (
    <Button onClick={signInWithLinkedIn} variant="outline" className="h-10">
      <TypographyMuted>Sign in with </TypographyMuted>
      <Linkedin className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  );
}
