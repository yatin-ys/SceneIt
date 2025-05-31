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
import { Toaster } from "@/components/ui/sonner";
import { UserButton } from "@/components/auth/user-button";
import { createClient } from "@/lib/supabase/server";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
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
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 lg:gap-6 flex-1">
                <Link 
                  href="/" 
                  className="flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <h1 className="text-2xl font-bold tracking-tight">
                    SceneIt
                  </h1>
                </Link>
                <div className="hidden sm:block w-full max-w-md">
                  <Suspense fallback={null}>
                    <SearchInput />
                  </Suspense>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/discover"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Discover
                </Link>
                <UserButton user={user} />
                <DarkModeToggle />
              </div>
            </nav>
            <div className="sm:hidden container mx-auto px-4 pb-4">
              <Suspense fallback={null}>
                <SearchInput />
              </Suspense>
            </div>
          </header>

          <main className="flex-grow container mx-auto px-4 pb-8">
            {children}
          </main>
          <Toaster richColors closeButton />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}