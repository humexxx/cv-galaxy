"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CVEditService } from "@/lib/services/cv-edit-service";
import { workExperienceUpdateSchema, type WorkExperienceUpdate } from "@/schemas/cv";
import type { WorkExperience } from "@/types/cv";

// TipTap is only ever needed by an authenticated owner who opens this dialog —
// keep the whole editor stack out of the initial payload for readers.
const RichTextEditor = dynamic(
  () =>
    import("@/components/ui/rich-text-editor").then((m) => m.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="h-10 border-b border-border bg-muted/60" />
        <div className="min-h-[180px] space-y-2 px-3 py-3">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
      </div>
    ),
  }
);

type FormData = WorkExperienceUpdate;

interface EditWorkExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workExperience: WorkExperience;
  username: string;
}

export function EditWorkExperienceDialog({
  open,
  onOpenChange,
  workExperience,
  username,
}: EditWorkExperienceDialogProps) {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(workExperienceUpdateSchema),
    defaultValues: {
      title: workExperience.title,
      description: workExperience.description,
      responsibilitiesHtml: workExperience.responsibilitiesHtml,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: workExperience.title,
        description: workExperience.description,
        responsibilitiesHtml: workExperience.responsibilitiesHtml,
      });
    }
  }, [open, workExperience, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await CVEditService.updateWorkExperience(username, workExperience.id!, {
        title: data.title,
        description: data.description,
        responsibilitiesHtml: data.responsibilitiesHtml,
      });
      toast.success("Work experience updated");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update work experience"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Work Experience</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input id="title" placeholder="e.g. Senior Software Engineer" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Brief description of your role..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Responsibilities</Label>
            <Controller
              control={control}
              name="responsibilitiesHtml"
              render={({ field }) => (
                <RichTextEditor value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.responsibilitiesHtml && (
              <p className="text-sm text-destructive">
                {errors.responsibilitiesHtml.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
