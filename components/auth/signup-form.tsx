// components/auth/signup-form.tsx
"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
// Import FormActionState and the correctly typed actions
import {
  signUpWithEmail,
  signInWithGoogle,
  FormActionState,
} from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserPlus, Loader2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <UserPlus className="mr-2 h-4 w-4" />
      )}
      Sign Up
    </Button>
  );
}

export function SignupForm() {
  // Explicitly provide types to useActionState
  const [state, formAction] = useActionState<FormActionState, FormData>(
    signUpWithEmail,
    null
  );
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    // `state` can be null, so use optional chaining
    if (state?.error) {
      toast.error(state.error, {
        description: state.fieldErrors
          ? Object.values(state.fieldErrors).flat().join(", ")
          : undefined,
      });
    }
    // `state` can be null, check for `success` and `message` before accessing
    if (state?.success && state.message) {
      toast.success(state.message);
    }
  }, [state]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    // signInWithGoogle has its own return type, not FormActionState
    const result = await signInWithGoogle();
    if (result?.url) {
      window.location.href = result.url;
    } else if (result?.error) {
      toast.error(result.error);
      setGoogleLoading(false);
    }
  };

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          required
        />
        {/* `state` can be null */}
        {state?.fieldErrors?.email && (
          <p className="text-xs text-red-500">
            {state.fieldErrors.email.join(", ")}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
        {/* `state` can be null */}
        {state?.fieldErrors?.password && (
          <p className="text-xs text-red-500">
            {state.fieldErrors.password.join(", ")}
          </p>
        )}
      </div>
      <SubmitButton />
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "G"
        )}{" "}
        {/* Replace with Google icon */}
        Sign Up with Google
      </Button>
    </form>
  );
}
