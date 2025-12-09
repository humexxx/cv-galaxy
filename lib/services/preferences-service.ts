import type { UserPreferences } from "@/types/auth";
import { userPreferencesSchema } from "@/schemas/auth";

export class PreferencesService {
  // Client-side method to get preferences via API
  static async getPreferences(username: string): Promise<UserPreferences> {
    try {
      const response = await fetch(`/api/users/${username}/preferences`);
      
      if (!response.ok) {
        return { showContractors: true };
      }

      const data = await response.json();
      const validated = userPreferencesSchema.parse(data);
      return validated;
    } catch (error) {
      console.error("Error fetching preferences:", error);
      return { showContractors: true };
    }
  }

  static async updatePreferences(
    username: string,
    preferences: Partial<UserPreferences>
  ): Promise<{ error: Error | null }> {
    try {
      const response = await fetch(`/api/users/${username}/preferences`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }
}
