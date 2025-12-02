"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AiButton from "@/components/ui/ai-button";
import { AiChat } from "@/components/ai-chat";
import { ChatService } from "@/lib/services/chat-service";
import type { AIModel } from "@/types/ai";

interface CvWithChatLayoutProps {
  children: React.ReactNode;
}

export function CvWithChatLayout({ children }: CvWithChatLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-5.1");
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  useEffect(() => {
    async function fetchModels() {
      try {
        const data = await ChatService.getModels();
        setModels(data.models);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setIsLoadingModels(false);
      }
    }

    if (isChatOpen) {
      fetchModels();
    }
  }, [isChatOpen]);

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

          <AiChat
            models={models}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            isLoadingModels={isLoadingModels}
          />
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
