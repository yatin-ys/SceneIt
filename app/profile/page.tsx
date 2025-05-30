// app/profile/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { UpdateProfileForm } from "@/components/auth/update-profile-form";
import {
  Card,
  CardContent,
  /*CardDescription,*/
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// If you have shadcn-ui Separator:
// import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "My Profile | SceneIt",
  description: "Manage your account settings.",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Please log in to view your profile.");
  }

  // Check if the user signed up via email/password or OAuth
  // `user.app_metadata.provider` will be 'google', 'github', etc. for OAuth
  // or undefined/null (or sometimes 'email') for email/password.
  const isEmailProvider =
    !user.app_metadata.provider || user.app_metadata.provider === "email";

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">My Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Email Address
            </p>
            <p>{user.email}</p>
          </div>
          {user.user_metadata.full_name && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Current Display Name
              </p>
              <p>{user.user_metadata.full_name}</p>
            </div>
          )}
          {/*
           user.user_metadata.username && (
             <div>
                <p className="text-sm font-medium text-muted-foreground">Username</p>
                <p>{user.user_metadata.username}</p>
            </div>
          )
          */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Joined SceneIt
            </p>
            <p>
              {new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          {user.app_metadata.provider &&
            user.app_metadata.provider !== "email" && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sign-in Method
                </p>
                <p className="capitalize">{user.app_metadata.provider}</p>
              </div>
            )}
        </CardContent>
      </Card>

      <UpdateProfileForm
        currentFullName={user.user_metadata.full_name || ""}
        // currentUsername={user.user_metadata.username || ""}
      />

      {isEmailProvider && (
        <>
          {/* <Separator className="my-6" />  Use if available */}
          <hr className="my-6 border-border" />
          <UpdatePasswordForm />
        </>
      )}

      {/* 
      <hr className="my-6 border-border" />
      <Card className="border-destructive">
        <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Account deletion is permanent and cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button variant="destructive" disabled>Delete My Account (Coming Soon)</Button>
        </CardContent>
      </Card>
      */}
    </main>
  );
}
