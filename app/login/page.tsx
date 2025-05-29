// app/login/page.tsx
import { LoginForm } from "@/components/auth/login-form";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { createClient } from "@/lib/supabase/server"; // Standard import
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SearchParamErrorDisplay } from "@/components/auth/search-param-error-display";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient(); // Key change: await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/"); // If already logged in, redirect to home
  }

  return (
    <AuthFormWrapper
      title="Welcome Back!"
      description="Sign in to continue to SceneIt."
      footerText="Don't have an account?"
      footerLinkHref="/signup"
      footerLinkText="Sign Up"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamErrorDisplay searchParams={searchParams} />
      </Suspense>
      <LoginForm />
    </AuthFormWrapper>
  );
}