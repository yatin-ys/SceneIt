// components/auth/update-profile-form.tsx
"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import {
  updateUserProfile,
  ProfileFormActionState,
} from "@/app/profile/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, UserCog } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UpdateProfileFormProps {
  currentFullName: string;
  // currentUsername?: string; // If you add username
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <UserCog className="mr-2 h-4 w-4" />
      )}
      Save Changes
    </Button>
  );
}

export function UpdateProfileForm({ currentFullName }: UpdateProfileFormProps) {
  const [state, formAction] = useActionState<ProfileFormActionState, FormData>(
    updateUserProfile,
    null
  );
  const [fullName, setFullName] = useState(currentFullName);
  // const [username, setUsername] = useState(currentUsername || "");

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
    }
  }, [state]);

  // Update local state if the prop changes (e.g., after successful server update and re-render)
  useEffect(() => {
    setFullName(currentFullName);
  }, [currentFullName]);
  // useEffect(() => {
  //   setUsername(currentUsername || "");
  // }, [currentUsername]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your display name. This will be shown publicly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Your full name (e.g. Jane Doe)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {state?.fieldErrors?.fullName && (
              <p className="text-xs text-destructive">
                {state.fieldErrors.fullName.join(", ")}
              </p>
            )}
          </div>
          {/* 
          <div className="space-y-2">
            <Label htmlFor="username">Username (optional)</Label>
            <Input 
              id="username" 
              name="username" 
              type="text" 
              placeholder="A unique username (e.g. jane_doe)" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {state?.fieldErrors?.username && (
              <p className="text-xs text-destructive">{state.fieldErrors.username.join(", ")}</p>
            )}
          </div>
          */}
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
