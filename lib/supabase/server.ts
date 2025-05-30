// lib/supabase/server.ts
import { createServerClient, type CookieOptions as SupabaseCookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SerializeOptions } from 'cookie'; // Corrected import

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables."
    );
  }
  if (!supabaseAnonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in environment variables."
    );
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: SupabaseCookieOptions) {
        try {
          // The object passed to cookieStore.set needs to match its expected signature.
          // SupabaseCookieOptions is Partial<SerializeOptions>.
          // The actual set method on cookieStore might have its own expectations.
          // We cast the options part to ensure compatibility.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (cookieStore as any).set(name, value, options as SerializeOptions);
        } catch {
          // The `set` method was called from a Server Component
        }
      },
      remove(name: string, options: SupabaseCookieOptions) {
        try {
          // For removal, typically you'd set an expired cookie or just remove.
          // Here, following Supabase's pattern of using set with empty value.
          // The options for removal usually include path and domain, and expires: new Date(0)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (cookieStore as any).set(name, "", { ...options, maxAge: 0 } as SerializeOptions);
        } catch {
          // Similar to set
        }
      },
    },
  });
}