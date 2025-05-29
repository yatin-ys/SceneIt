// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import "./globals.css";
import Link from "next/link";
import { Suspense } from "react"; // <-- Add Suspense
import { SearchInput } from "@/components/SearchInput"; // <-- Client component
import { Analytics } from '@vercel/analytics/next';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            <div className="flex flex-col items-center relative gap-4 sm:gap-6">
              <div className="absolute right-0 top-0 sm:right-4 sm:top-4">
                <DarkModeToggle />
              </div>
              <Link href="/" className="inline-block">
                <h1 className="text-6xl sm:text-7xl font-bold text-center tracking-tight leading-tight">
                  SceneIt
                </h1>
              </Link>
              {/* Wrapped SearchInput in Suspense */}
              <div className="w-full max-w-md mt-2">
                <Suspense fallback={null}>
                  <SearchInput />
                </Suspense>
              </div>
            </div>
          </header>
          <main className="flex-grow container mx-auto px-4 pb-8">
            {children}
          </main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
