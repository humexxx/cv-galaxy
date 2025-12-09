import type { UserPreferences } from "@/types/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export class PreferencesServerService {
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
}
