import { supabase } from "@/lib/supabase";
import type { User, AuthSession } from "@/types/auth";
import type { Provider } from "@supabase/supabase-js";

export class AuthService {
  static async signInWithOAuth(provider: Provider): Promise<{ error: Error | null }> {
    try {
      const redirectTo = process.env.NEXT_PUBLIC_AUTH_RETURN_URL || `${window.location.origin}/auth/callback`;
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

  static async getSession(): Promise<AuthSession> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return { user: null, isAuthenticated: false };
      }

      const user: User = {
        id: session.user.id,
        email: session.user.email || "",
        username: session.user.user_metadata?.username,
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
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        callback({ user: null, isAuthenticated: false });
        return;
      }

      const user: User = {
        id: session.user.id,
        email: session.user.email || "",
        username: session.user.user_metadata?.username,
        fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
        avatar: session.user.user_metadata?.avatar_url || 
                session.user.user_metadata?.picture || 
                session.user.user_metadata?.profile_picture_url,
      };

      callback({ user, isAuthenticated: true });
    });
  }
}
