import type { UserPreferences } from "@/types/auth";
import { userPreferencesSchema } from "@/schemas/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export class PreferencesService {
  // Server-side method to get preferences directly from database
  static async getPreferencesFromDB(username: string): Promise<UserPreferences> {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.username, username),
        with: {
          preferences: true,
        },
      });

      if (!user?.preferences) {
        return { showContractors: true };
      }

      return {
        showContractors: user.preferences.showContractors,
      };
    } catch (error) {
      console.error("Error fetching preferences from DB:", error);
      return { showContractors: true };
    }
  }

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
