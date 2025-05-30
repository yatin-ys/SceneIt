import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Movie Data Provided By
            </span>
            <Link
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <Image
                src="/Alt_Short_Blue.svg"
                alt="TMDB Logo"
                width={100}
                height={16}
                className="h-auto dark:brightness-200"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
