"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  ChefHat,
  Home,
  LogOut,
  UtensilsCrossed,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

export default function AdminNav() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ description: "You have been logged out." });
      router.push('/admin/login');
    } catch (error) {
      toast({ variant: "destructive", title: "Logout failed", description: "Could not log out. Please try again." });
    }
  };

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/admin/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <ChefHat className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">HubSafari</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/admin/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <UtensilsCrossed className="h-5 w-5" />
                <span className="sr-only">Menu Items</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Menu Items</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href="/"
                        target="_blank"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                        <Home className="h-5 w-5" />
                        <span className="sr-only">View Site</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">View Site</TooltipContent>
            </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
