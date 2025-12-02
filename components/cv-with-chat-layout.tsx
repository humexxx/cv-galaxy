"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles } from "lucide-react";
import AiButton from "@/components/ui/ai-button";
import type { AIModel, AIModelsResponse } from "@/types/ai";

interface CvWithChatLayoutProps {
  children: React.ReactNode;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Summarize this CV",
  "What are the key skills?",
  "Years of experience?",
  "Suggest improvements",
];

export function CvWithChatLayout({ children }: CvWithChatLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-5.1");
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch("/api/models");
        const data: AIModelsResponse = await response.json();
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const lineHeight = 24; // approximate line height
      const maxHeight = lineHeight * 10; // 10 rows max
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [inputMessage]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: content.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // TODO: API call will be implemented here
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel,
        }),
      });

      const data = await response.json();
      
      if (data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

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

          <div className="flex-1 flex flex-col p-6 pt-0">
            {/* Chat Messages */}
            <ScrollArea className="flex-1 pr-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 py-8">
                  <div className="text-center space-y-2">
                    <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50" />
                    <h3 className="font-semibold">Start a conversation</h3>
                    <p className="text-sm text-muted-foreground">
                      Ask me anything about this CV
                    </p>
                  </div>
                  
                  {/* Suggestions */}
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
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input Area with Model Selector */}
            <div className="rounded-lg border bg-background p-2">
              <textarea
                ref={textareaRef}
                placeholder="Ask about this CV..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputMessage);
                  }
                }}
                disabled={isLoading}
                rows={1}
                className="w-full resize-none bg-transparent px-1 py-1 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-y-auto"
              />
              <div className="flex items-center justify-between gap-2 pt-2">
                <Select
                  value={selectedModel}
                  onValueChange={setSelectedModel}
                  disabled={isLoadingModels}
                >
                  <SelectTrigger className="h-7 w-auto text-xs border-0 bg-secondary/50 hover:bg-secondary focus:ring-0 px-2 gap-1">
                    <SelectValue 
                      placeholder={isLoadingModels ? "..." : "Model"} 
                    />
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
                  size="icon"
                  onClick={() => handleSendMessage(inputMessage)}
                  disabled={!inputMessage.trim() || isLoading}
                  className="h-7 w-7"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
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
