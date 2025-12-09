"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PreferencesService } from "@/lib/services/preferences-service";
import { useAuth } from "@/components/auth-provider";

interface ContractorToggleProps {
  username: string;
  onToggle: (showContractors: boolean) => void;
}

export function ContractorToggle({ username, onToggle }: ContractorToggleProps) {
  const { user, isAuthenticated } = useAuth();
  const [showContractors, setShowContractors] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Check if viewing own profile
  useEffect(() => {
    async function checkOwnership() {
      if (!isAuthenticated || !user?.email) {
        setIsOwnProfile(false);
        return;
      }

      // First check if username matches (fastest)
      if (user.username === username) {
        setIsOwnProfile(true);
        return;
      }

      // Fallback: check via API if email matches username
      try {
        const response = await fetch(`/api/user/check?email=${encodeURIComponent(user.email)}`);
        const data = await response.json();
        setIsOwnProfile(data.exists && data.username === username);
      } catch (error) {
        console.error('Error checking ownership:', error);
        setIsOwnProfile(false);
      }
    }

    checkOwnership();
  }, [isAuthenticated, user?.email, user?.username, username]);

  useEffect(() => {
    if (isOwnProfile) {
      PreferencesService.getPreferences(username).then((prefs) => {
        setShowContractors(prefs.showContractors);
        onToggle(prefs.showContractors);
      });
    }
  }, [isOwnProfile, username, onToggle]);

  // Only show if viewing own profile
  if (!isOwnProfile) {
    return null;
  }

  const handleToggle = async (checked: boolean) => {
    setShowContractors(checked);
    onToggle(checked);
    
    setLoading(true);
    const { error } = await PreferencesService.updatePreferences(username, {
      showContractors: checked,
    });
    setLoading(false);

    if (error) {
      toast.error("Failed to update preference");
    } else {
      toast.success(checked ? "Contractors will be shown" : "Contractors hidden");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="contractor-toggle" className="text-sm text-muted-foreground cursor-pointer">
        Show contractors
      </Label>
      <Switch
        id="contractor-toggle"
        checked={showContractors}
        onCheckedChange={handleToggle}
        disabled={loading}
      />
    </div>
  );
}
