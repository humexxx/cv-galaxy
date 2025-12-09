"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "@/lib/services/auth-service";
import type { AuthSession } from "@/types/auth";

interface AuthContextType extends AuthSession {
  signInWithLinkedIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AuthService.getSession().then((newSession) => {
      setSession(newSession);
      setIsLoading(false);
    });

    const { data: { subscription } } = AuthService.onAuthStateChange(setSession);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithLinkedIn = async () => {
    const { error } = await AuthService.signInWithOAuth("linkedin_oidc");
    if (error) {
      console.error("Error signing in:", error);
    }
  };

  const signOut = async () => {
    const { error } = await AuthService.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      setSession({ user: null, isAuthenticated: false });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...session,
        isLoading,
        signInWithLinkedIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
