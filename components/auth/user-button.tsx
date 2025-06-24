// components/auth/user-button.tsx
"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/auth/actions";
import {
  LogOut,
  LogIn,
  UserPlus,
  UserCircle,
  ListVideo,
  Clapperboard,
} from "lucide-react";
import { toast } from "sonner";

interface UserButtonProps {
  user: User | null;
}

export function UserButton({ user }: UserButtonProps) {
  const handleSignOut = async () => {
    const result = await signOut();
    if (result?.error) {
      toast.error(result.error);
    }
    // Redirect is handled by the server action
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/signup">
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </Link>
        </Button>
      </div>
    );
  }

  const userEmail = user.email || "User";
  const fallbackLetter = (user.user_metadata?.full_name || userEmail)
    .charAt(0)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.user_metadata?.avatar_url}
              alt={user.user_metadata?.full_name || userEmail}
            />
            <AvatarFallback>{fallbackLetter}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.user_metadata?.full_name || userEmail}
            </p>
            {user.user_metadata?.full_name &&
              user.email && ( // Show email only if full_name is also present
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
              )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/watchlist" className="cursor-pointer">
            <ListVideo className="mr-2 h-4 w-4" />
            <span>My Watchlist</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/watched" className="cursor-pointer">
            <Clapperboard className="mr-2 h-4 w-4" />
            <span>Scene It</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
