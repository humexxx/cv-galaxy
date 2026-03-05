import { z } from "zod";

export const workExperienceUpdateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  responsibilitiesHtml: z.string().min(1, "Responsibilities are required"),
});

export type WorkExperienceUpdate = z.infer<typeof workExperienceUpdateSchema>;

export const technologiesUpdateSchema = z.object({
  technologies: z.array(z.string().min(1, "Technology cannot be empty")),
});

export type TechnologiesUpdate = z.infer<typeof technologiesUpdateSchema>;
