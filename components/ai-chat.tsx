"use client";

import { useState, useEffect, useRef } from "react";
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
import type { ChatMessage } from "@/schemas/chat";
import type { AIModel } from "@/types/ai";

interface AiChatProps {
  models: AIModel[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  isLoadingModels: boolean;
}

const SUGGESTIONS = [
  "Summarize this CV",
  "What are the key skills?",
  "Years of experience?",
  "Suggest improvements",
];

export function AiChat({ models, selectedModel, onModelChange, isLoadingModels }: AiChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const lineHeight = 24;
      const maxHeight = lineHeight * 10;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [inputMessage]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: content.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const data = await ChatService.sendMessage(
        [...messages, userMessage],
        selectedModel
      );

      if (data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Sorry, I encountered an error. Please try again.";
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
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
            onValueChange={onModelChange}
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
  );
}
