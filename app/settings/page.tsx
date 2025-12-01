import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TypographyH2, TypographyMuted } from "@/components/ui/typography";

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-8">
        <div>
          <TypographyH2>Settings</TypographyH2>
          <TypographyMuted>
            Manage your account settings and preferences.
          </TypographyMuted>
        </div>

        <Separator />

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>
                Manage your privacy settings and account security.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Privacy and security settings are under development. This will
                include options for two-factor authentication, password changes,
                and privacy controls.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
