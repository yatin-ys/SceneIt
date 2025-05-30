// app/login/page.tsx
import { LoginForm } from "@/components/auth/login-form";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SearchParamErrorDisplay } from "@/components/auth/search-param-error-display";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  const supabase = await createClient();
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
        <SearchParamErrorDisplay searchParams={resolvedSearchParams} />
      </Suspense>
      <LoginForm />
    </AuthFormWrapper>
  );
}