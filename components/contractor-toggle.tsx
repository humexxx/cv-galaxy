"use client";

import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PreferencesService } from "@/lib/services/preferences-service";
import { useAuth } from "@/components/auth-provider";

interface ContractorToggleProps {
  username: string;
  /**
   * Current value, owned by the page. Seeded server-side from the stored
   * preference so the switch renders in its real position on first paint.
   */
  showContractors: boolean;
  onToggle: (showContractors: boolean) => void;
}

export function ContractorToggle({
  username,
  showContractors,
  onToggle,
}: ContractorToggleProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isPending, startTransition] = useTransition();

  // Derived during render — no effect, no fetch, no late pop-in. `username` on
  // the auth user comes from the same session-backed lookup `/api/user/check`
  // would have done, so the old fallback request was redundant.
  const isOwnProfile = isAuthenticated && user?.username === username;

  if (authLoading || !isOwnProfile) {
    return null;
  }

  const handleToggle = (checked: boolean) => {
    onToggle(checked);

    startTransition(async () => {
      const { error } = await PreferencesService.updatePreferences(username, {
        showContractors: checked,
      });

      if (error) {
        // Roll back the optimistic flip.
        onToggle(!checked);
        toast.error("Failed to update preference");
      } else {
        toast.success(
          checked ? "Contractors will be shown" : "Contractors hidden"
        );
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Label
        htmlFor="contractor-toggle"
        className="text-sm text-muted-foreground cursor-pointer"
      >
        Show contractors
      </Label>
      <Switch
        id="contractor-toggle"
        checked={showContractors}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
    </div>
  );
}
