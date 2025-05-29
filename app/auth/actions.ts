// app/auth/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const emailSchema = z.string().email({ message: "Invalid email address." });
const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." });

const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Define a type for the state managed by useFormState
type ZodFieldErrors = {
  [key: string]: string[] | undefined;
};

export type FormActionState = {
  error?: string;
  fieldErrors?: ZodFieldErrors;
  success?: boolean; // Used by signUpWithEmail
  message?: string; // Used by signUpWithEmail
} | null; // Crucially, allow null to match initialState and for initial calls

export async function signUpWithEmail(
  prevState: FormActionState, // Use the defined state type
  formData: FormData
): Promise<FormActionState> {
  // Action returns the same state type
  const supabase = createClient();
  const origin = (await headers()).get("origin");

  const validatedFields = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid form data.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const { error } = await (
    await supabase
  ).auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Sign up error:", error);
    return { error: error.message || "Could not authenticate user." };
  }

  return { success: true, message: "Check your email to confirm sign up." };
}

export async function signInWithEmail(
  prevState: FormActionState, // Use the defined state type
  formData: FormData
): Promise<FormActionState> {
  // Action returns the same state type
  const supabase = createClient();

  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid form data.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const { error: authError } = await (
    await supabase
  ).auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    console.error("Sign in error:", authError);
    return { error: authError.message || "Could not authenticate user." };
  }

  // If login is successful, Supabase sets a cookie.
  // The redirect will then happen. redirect() throws an error that Next.js handles.
  // This means the function won't "return" in the traditional sense after this call.
  // The Promise<FormActionState> is satisfied because this path doesn't complete normally.
  redirect("/");
}

// signInWithGoogle is not typically used with useFormState in the same way,
// as it involves a browser redirect. Its return type can be more specific to its needs.
export async function signInWithGoogle(): Promise<{
  success?: boolean;
  url?: string;
  error?: string;
}> {
  const supabase = createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await (
    await supabase
  ).auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Google sign in error:", error);
    return { error: "Could not authenticate with Google." };
  }

  if (data.url) {
    return { success: true, url: data.url };
  }
  return { error: "Google sign in failed unexpectedly." };
}

// signOut also redirects, so its return type for useFormState isn't usually relevant.
export async function signOut(): Promise<{ error?: string } | void> {
  // void because redirect throws
  const supabase = createClient();
  const { error } = await (await supabase).auth.signOut();

  if (error) {
    console.error("Sign out error:", error);
    return { error: "Could not sign out." };
  }
  redirect("/login");
}
