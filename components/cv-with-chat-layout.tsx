"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
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
import type { CVData } from "@/types/cv";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsTablet } from "@/hooks/use-is-tablet";

interface CvWithChatLayoutProps {
  children: React.ReactNode;
  userId: string;
  cvData: CVData;
}

export function CvWithChatLayout({ children, userId, cvData }: CvWithChatLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o-mini");
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const aiChatRef = useRef<AiChatRef>(null);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

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

  const handleNewChat = () => {
    aiChatRef.current?.resetChat();
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  // Determinar el ancho del chat según el breakpoint
  const getChatWidth = () => {
    if (isTablet) return "w-[90vw] sm:w-[350px]"; // Mobile/Tablet en drawer
    return "w-[350px] xl:w-[400px]"; // Desktop: más estrecho en pantallas medianas, normal en grandes
  };

  const chatWidth = getChatWidth();
  const desktopChatWidth = isTablet ? "" : "mr-[350px] xl:mr-[400px]";

  return (
    <div className="flex h-full">
      <div className={`flex-1 overflow-y-auto ${!isTablet && isChatOpen ? desktopChatWidth : ''}`}>{children}</div>

      {isTablet ? (
        <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
          <SheetContent
            side="right"
            className={`${chatWidth} p-0 flex flex-col outline-0`}
          >
            <SheetHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between space-y-0">
              <SheetTitle>AI Assistant</SheetTitle>
              <button
                onClick={handleNewChat}
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
              userId={userId}
              cvData={cvData}
            />
          </SheetContent>
        </Sheet>
      ) : (
        isChatOpen && (
          <div className="fixed right-0 top-[65px] h-[calc(100vh-65px)] w-[350px] xl:w-[400px] border-l bg-background flex flex-col z-40">
            <div className="px-6 pt-6 pb-4 flex flex-row items-center justify-between border-b">
              <h2 className="text-lg font-semibold">AI Assistant</h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleNewChat}
                  className="h-8 w-8 rounded-md hover:bg-accent flex items-center justify-center transition-opacity opacity-70 hover:opacity-100 cursor-pointer"
                  aria-label="New chat"
                  title="New chat"
                >
                  <Plus className="size-4" />
                </button>
                <button
                  onClick={handleCloseChat}
                  className="h-8 w-8 rounded-md hover:bg-accent flex items-center justify-center transition-opacity opacity-70 hover:opacity-100 cursor-pointer"
                  aria-label="Close chat"
                  title="Close chat"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
            <AiChat
              ref={aiChatRef}
              models={models}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              isLoadingModels={isLoadingModels}
              userId={userId}
              cvData={cvData}
            />
          </div>
        )
      )}

      {/* Floating AI Button - oculto cuando el chat está abierto en desktop */}
      {!(isChatOpen && !isTablet) && (
        <div className="fixed bottom-8 right-8 z-50">
          <AiButton
            label="AI Assistant"
            showLabel={!isMobile}
            className="my-0"
            onClick={() => setIsChatOpen(true)}
          />
        </div>
      )}
    </div>
  );
}
