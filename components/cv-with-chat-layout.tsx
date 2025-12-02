"use client";

import { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AiButton from "@/components/ui/ai-button";
import { AiChat, type AiChatRef } from "@/components/ai-chat";
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
  const aiChatRef = useRef<AiChatRef>(null);

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
          className="w-[400px] sm:w-[400px] p-0 flex flex-col outline-0"
        >
          <SheetHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between space-y-0">
            <SheetTitle>AI Assistant</SheetTitle>
            <button
              onClick={() => {
                aiChatRef.current?.resetChat();
              }}
              className="h-8 w-8 rounded-md hover:bg-accent flex items-center justify-center transition-opacity opacity-70 hover:opacity-100 cursor-pointer mr-8"
              aria-label="New chat"
              title="New chat"
            >
              <Plus className="size-4" />
            </button>
          </SheetHeader>

          <AiChat
            ref={aiChatRef}
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
