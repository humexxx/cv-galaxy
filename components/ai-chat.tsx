"use client";

import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Send, Sparkles } from "lucide-react";
import { ChatService } from "@/lib/services/chat-service";

import {
  chatInputSchema,
  type ChatInput,
  type ChatMessage,
} from "@/schemas/chat";
import type { AIModel } from "@/types/ai";

export interface AiChatRef {
  resetChat: () => void;
}

interface AiChatProps {
  models: AIModel[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  isLoadingModels: boolean;
  userId: string;
}

const SUGGESTIONS = [
  "Summarize this CV",
  "What are the key skills?",
  "Years of experience?",
  "Suggest improvements",
];

export const AiChat = forwardRef<AiChatRef, AiChatProps>(function AiChat({
  models,
  selectedModel,
  onModelChange,
  isLoadingModels,
  userId,
}, ref) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset } = useForm<ChatInput>(
    {
      resolver: zodResolver(chatInputSchema),
      defaultValues: { message: "" },
    }
  );

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const onSubmit = async (data: ChatInput) => {
    if (isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: data.message.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    reset();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "" },
    ]);

    try {
      await ChatService.sendMessage(
        [...messages, userMessage],
        selectedModel,
        userId,
        (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: updated[lastIndex].content + chunk,
            };
            return updated;
          });
          
          setTimeout(() => {
            const scrollArea = scrollAreaRef.current?.querySelector(
              "[data-radix-scroll-area-viewport]"
            );
            if (scrollArea) {
              scrollArea.scrollTop = scrollArea.scrollHeight;
            }
          }, 0);
        }
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Sorry, I encountered an error. Please try again.";

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = {
          ...updated[lastIndex],
          content: errorMessage,
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        const scrollArea = scrollAreaRef.current?.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (scrollArea) {
          scrollArea.scrollTop = scrollArea.scrollHeight;
        }
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSubmit({ message: suggestion });
  };

  const handleResetChat = () => {
    setMessages([]);
    reset();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  useImperativeHandle(ref, () => ({
    resetChat: handleResetChat,
  }));

  return (
    <div className="flex-1 grid grid-rows-[1fr_auto] gap-4 p-6 pt-0 overflow-hidden">
      <div className="overflow-hidden min-h-0">
        <ScrollArea ref={scrollAreaRef} className="h-full pr-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 py-8 pl-4">
              <div className="text-center space-y-2">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <h3 className="font-semibold">Start a conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Ask me anything about this CV
                </p>
              </div>

              <div className="w-full space-y-2">
                <p className="text-xs text-muted-foreground">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <Badge
                      key={suggestion}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="min-h-fit">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-lg border bg-background p-2"
        >
          <textarea
            {...register("message", {
              onChange: () => {
                if (textareaRef.current) {
                  textareaRef.current.style.height = "auto";
                  const scrollHeight = textareaRef.current.scrollHeight;
                  textareaRef.current.style.height = `${Math.min(scrollHeight, 240)}px`;
                }
              },
            })}
            ref={(e) => {
              register("message").ref(e);
              textareaRef.current = e;
            }}
            placeholder="Ask about this CV..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
            disabled={isLoading}
            rows={1}
            className="w-full resize-none bg-transparent px-1 py-1 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-y-auto max-h-60"
          />
          <div className="flex items-center justify-between gap-2 pt-2">
            <Select
              value={selectedModel}
              onValueChange={onModelChange}
              disabled={isLoadingModels}
            >
              <SelectTrigger className="h-7 w-auto text-xs border-0 bg-secondary/50 hover:bg-secondary focus:ring-0 px-2 gap-1">
                <SelectValue placeholder={isLoadingModels ? "..." : "Model"} />
              </SelectTrigger>
              <SelectContent>
                {isLoadingModels ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  models.map((model) => (
                    <TooltipProvider key={model.id} delayDuration={2000}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SelectItem value={model.id} className="text-xs">
                            {model.name}
                          </SelectItem>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <p>{model.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))
                )}
              </SelectContent>
            </Select>

            <Button
              type="submit"
              size="icon"
              disabled={isLoading}
              className="h-7 w-7"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
});
