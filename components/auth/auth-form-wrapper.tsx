// components/auth/auth-form-wrapper.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface AuthFormWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footerText: string;
  footerLinkHref: string;
  footerLinkText: string;
}

export function AuthFormWrapper({
  children,
  title,
  description,
  footerText,
  footerLinkHref,
  footerLinkText,
}: AuthFormWrapperProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {footerText}{" "}
            <Link
              href={footerLinkHref}
              className="underline hover:text-primary"
            >
              {footerLinkText}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
