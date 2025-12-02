"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AiButton from "@/components/ui/ai-button";

interface CvWithChatLayoutProps {
  children: React.ReactNode;
}

export function CvWithChatLayout({ children }: CvWithChatLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex h-full">
      <div className={`flex-1 overflow-y-auto `}>{children}</div>

      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent
          side="right"
          className="w-[400px] sm:w-[400px] p-0 flex flex-col"
        >
          <SheetHeader className="p-6 pb-4">
            <SheetTitle>AI Assistant</SheetTitle>
          </SheetHeader>

          <div className="flex-1 p-6 pt-0">
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Chat interface coming soon...
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Floating AI Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <AiButton
          label="AI Assistant"
          className="my-0"
          onClick={() => setIsChatOpen(true)}
        />
      </div>
    </div>
  );
}
