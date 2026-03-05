"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CVEditService } from "@/lib/services/cv-edit-service";

interface EditTechnologiesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technologies: string[];
  username: string;
}

export function EditTechnologiesDialog({
  open,
  onOpenChange,
  technologies,
  username,
}: EditTechnologiesDialogProps) {
  const router = useRouter();
  const [techs, setTechs] = useState<string[]>(technologies);
  const [inputValue, setInputValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTechs(technologies);
      setInputValue("");
    }
  }, [open, technologies]);

  const addTech = () => {
    const value = inputValue.trim();
    if (value && !techs.includes(value)) {
      setTechs((prev) => [...prev, value]);
      setInputValue("");
      inputRef.current?.focus();
    }
  };

  const removeTech = (tech: string) => {
    setTechs((prev) => prev.filter((t) => t !== tech));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTech();
    } else if (e.key === "Backspace" && !inputValue && techs.length > 0) {
      setTechs((prev) => prev.slice(0, -1));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await CVEditService.updateTechnologies(username, { technologies: techs });
      toast.success("Technologies updated");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update technologies"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Technologies</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tech-input">Add Technology</Label>
            <div className="flex gap-2">
              <Input
                id="tech-input"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. TypeScript"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addTech}
                disabled={!inputValue.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter or click + to add. Backspace removes the last tag.
            </p>
          </div>

          <div className="min-h-20 rounded-md border bg-muted/30 p-3">
            {techs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No technologies added yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {techs.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(tech)}
                      className="rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                      aria-label={`Remove ${tech}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
