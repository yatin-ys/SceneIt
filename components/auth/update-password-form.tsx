// components/auth/update-password-form.tsx
"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import {
  updateUserPassword,
  ProfileFormActionState,
} from "@/app/profile/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { toast } from "sonner";
import { Loader2, KeyRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <KeyRound className="mr-2 h-4 w-4" />
      )}
      Update Password
    </Button>
  );
}

export function UpdatePasswordForm() {
  const [state, formAction] = useActionState<ProfileFormActionState, FormData>(
    updateUserPassword,
    null
  );

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error, {
        description: state.fieldErrors
          ? Object.values(state.fieldErrors).flat().join(", ")
          : undefined,
      });
    }
    if (state?.success && state.message) {
      toast.success(state.message);
      // Consider resetting form fields here if needed, though revalidation might handle it.
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Enter a new password for your account. Make sure it&apos;s strong!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              autoComplete="new-password"
            />
            {state?.fieldErrors?.newPassword && (
              <p className="text-xs text-destructive">
                {state.fieldErrors.newPassword.join(", ")}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
            />
            {state?.fieldErrors?.confirmPassword && (
              <p className="text-xs text-destructive">
                {state.fieldErrors.confirmPassword.join(", ")}
              </p>
            )}
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
