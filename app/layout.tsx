// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import "./globals.css";
import Link from "next/link";
import { Suspense } from "react";
import { SearchInput } from "@/components/SearchInput";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

// New imports (were already there, just confirming)
import { Toaster } from "@/components/ui/sonner";
import { UserButton } from "@/components/auth/user-button";
import { createClient } from "@/lib/supabase/server"; // For server-side user fetching

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SceneIt",
  description: "Movie tracking web app.",
};

export default async function RootLayout({ // Make it async
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch user on the server
  const supabase = await createClient(); // Key change: await createClient()
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="container mx-auto px-4 py-6 sm:py-8">
            {/* Main header flex container: stacks on small, row on sm+ */}
            {/* justify-between pushes left and right groups apart on sm+ */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">

              {/* Left Part: Title and Search Bar */}
              {/* Stacks on small, becomes row on sm+. order-2 ensures it's below auth on small screens */}
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-2 sm:gap-4 order-2 sm:order-1 w-full sm:w-auto">
                <Link href="/" className="inline-block flex-shrink-0">
                  {/* Adjusted title size for better fitting when side-by-side */}
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                    SceneIt
                  </h1>
                </Link>
                {/* Search Input: full width on small, constrained on larger */}
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
                  <Suspense fallback={null}>
                    <SearchInput />
                  </Suspense>
                </div>
              </div>

              {/* Right Part: Auth and Dark Mode Toggle */}
              {/* order-1 ensures it's at the top on small screens */}
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <UserButton user={user} /> {/* Pass user to UserButton */}
                <DarkModeToggle />
              </div>

            </div>
          </header>
          <main className="flex-grow container mx-auto px-4 pb-8">
            {children}
          </main>
          <Toaster richColors closeButton /> {/* Add Toaster for notifications */}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}