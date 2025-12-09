import { z } from "zod";

export const userPreferencesSchema = z.object({
  showContractors: z.boolean(),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;
