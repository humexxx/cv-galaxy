import { supabase } from "@/lib/supabase";
import type { User, AuthSession } from "@/types/auth";
import type { Provider, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { getBaseUrl } from "../env";

export class AuthService {
  static async signInWithOAuth(provider: Provider): Promise<{ error: Error | null }> {

    try {
      const redirectTo = getBaseUrl();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      });

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }

  static async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }

  static async getUsernameFromDB(): Promise<string | null> {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) return null;
      const data = await response.json();
      return data.username;
    } catch (error) {
      console.error("Error fetching username:", error);
      return null;
    }
  }

  static async getSession(): Promise<AuthSession> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return { user: null, isAuthenticated: false };
      }

      const username = await this.getUsernameFromDB();

      const user: User = {
        email: session.user.email || "",
        username,
        fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
        avatar: session.user.user_metadata?.avatar_url || 
                session.user.user_metadata?.picture || 
                session.user.user_metadata?.profile_picture_url,
      };

      return { user, isAuthenticated: true };
    } catch (error) {
      console.error("Error getting session:", error);
      return { user: null, isAuthenticated: false };
    }
  }

  static onAuthStateChange(callback: (session: AuthSession) => void) {
    return supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      if (!session) {
        callback({ user: null, isAuthenticated: false });
        return;
      }

      const username = await this.getUsernameFromDB();

      const user: User = {
        email: session.user.email || "",
        username,
        fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
        avatar: session.user.user_metadata?.avatar_url || 
                session.user.user_metadata?.picture || 
                session.user.user_metadata?.profile_picture_url,
      };

      callback({ user, isAuthenticated: true });
    });
  }
}
