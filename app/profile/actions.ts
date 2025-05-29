// app/profile/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export type ProfileFormActionState = {
  error?: string;
  fieldErrors?: { [key: string]: string[] | undefined };
  success?: boolean;
  message?: string;
} | null;

// Schema for password update
const passwordUpdateSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export async function updateUserPassword(
  prevState: ProfileFormActionState,
  formData: FormData
): Promise<ProfileFormActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated." };
  }
  // Ensure this action is only for email provider users
  if (user.app_metadata.provider && user.app_metadata.provider !== "email") {
    return { error: "Password cannot be changed for OAuth users." };
  }

  const validatedFields = passwordUpdateSchema.safeParse({
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid data.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: validatedFields.data.newPassword,
  });

  if (updateError) {
    console.error("Password update error:", updateError);
    return { error: updateError.message || "Could not update password." };
  }

  revalidatePath("/profile");
  return { success: true, message: "Password updated successfully." };
}

// Schema for profile update (e.g., full_name)
const profileUpdateSchema = z.object({
  fullName: z
    .string()
    .max(100, "Full name cannot exceed 100 characters.")
    .optional()
    .or(z.literal("")),
  // username: z.string().min(3, "Username must be >= 3 chars").max(50).regex(/^[a-zA-Z0-9_]+$/, "Invalid characters").optional().or(z.literal('')),
});

export async function updateUserProfile(
  prevState: ProfileFormActionState,
  formData: FormData
): Promise<ProfileFormActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated." };
  }

  const fullNameValue = formData.get("fullName") as string | null;
  // const usernameValue = formData.get("username") as string | null;

  const validatedFields = profileUpdateSchema.safeParse({
    fullName: fullNameValue,
    // username: usernameValue,
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid data.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const dataToUpdate: {
    full_name?: string | undefined /*, username?: string | undefined */;
  } = {};

  // Only add to dataToUpdate if the field was actually submitted and validated
  if (validatedFields.data.fullName !== undefined) {
    dataToUpdate.full_name =
      validatedFields.data.fullName === ""
        ? undefined
        : validatedFields.data.fullName; // Store empty as undefined to clear, or the value
  }
  // if (validatedFields.data.username !== undefined) {
  //   dataToUpdate.username = validatedFields.data.username === "" ? undefined : validatedFields.data.username;
  // }

  if (Object.keys(dataToUpdate).length === 0) {
    return { message: "No changes submitted.", success: true }; // No actual update needed
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: dataToUpdate, // Supabase uses 'data' for user_metadata
  });

  if (updateError) {
    console.error("Profile update error:", updateError);
    return { error: updateError.message || "Could not update profile." };
  }

  revalidatePath("/profile");
  revalidatePath("/", "layout"); // Revalidate layout to update UserButton with new name
  return { success: true, message: "Profile updated successfully." };
}
