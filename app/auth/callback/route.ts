// app/auth/callback/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient();
    const { error } = await (await supabase).auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        `${origin}/login?error=Could not authenticate user`
      );
    }
  } else {
    // This might also be the redirect from email confirmation
    const error_description = requestUrl.searchParams.get("error_description");
    if (error_description) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error_description)}`
      );
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/`);
}
