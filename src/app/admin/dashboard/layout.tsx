"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import AdminNav from '@/components/admin/admin-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-4 w-52" />
            </div>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AdminNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-1">
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-8 bg-background sm:rounded-tl-xl h-full">
            {children}
        </main>
      </div>
    </div>
  );
}
