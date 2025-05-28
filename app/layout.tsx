import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import "./globals.css";
import Link from "next/link"; // Import Link

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CineLog",
  description: "Media tracking web app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* START: New Header Section */}
          <header className="container mx-auto px-4 py-6 sm:py-8">
            <div className="flex flex-col items-center relative">
              {/* DarkModeToggle - Absolutely Positioned in Top Right */}
              <div className="absolute right-4 top-4">
                <DarkModeToggle />
              </div>

              {/* CineLog Title */}
              <Link href="/" className="inline-block">
                <h1 className="text-7xl font-bold text-center tracking-tight leading-tight">
                  CineLog
                </h1>
              </Link>
            </div>
          </header>
          {/* END: New Header Section */}
          {/* Main content area for pages */}
          <main className="flex-grow container mx-auto px-4 pb-8">
            {" "}
            {/* Added container and padding for main content */}
            {children}
          </main>

          {/* Optional: A global footer could go here */}
          {/* <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground border-t">
            © {new Date().getFullYear()} CineLog
          </footer> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
