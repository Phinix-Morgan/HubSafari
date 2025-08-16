
"use client";

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MenuItem } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, Sprout } from 'lucide-react';
import MenuItemsTable from '@/components/admin/menu-items-table';
import { Skeleton } from '@/components/ui/skeleton';
import { seedDatabase } from '@/lib/seed';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        // Removing orderby to prevent index requirement for basic listing
        const q = query(collection(db, 'menuItems'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const items: MenuItem[] = [];
            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() } as MenuItem);
            });
            // Sort client-side instead
            items.sort((a, b) => a.name.localeCompare(b.name));
            setMenuItems(items);
            if (loading) { // Only check for seeding on initial load
                if (items.length === 0) {
                    handleSeed(true); // Automatically seed if empty
                } else {
                    setLoading(false);
                }
            }
        }, (error) => {
            console.error("Error fetching menu items: ", error);
            toast({ variant: "destructive", title: "Error", description: "Could not fetch menu items." });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [loading, toast]); // Added toast to dependency array

    const handleSeed = async (silent = false) => {
        setIsSeeding(true);
        const result = await seedDatabase();
        if (!silent) {
            if (result.success) {
                toast({
                    title: "Database Seeded",
                    description: result.message,
                });
            } else {
                 toast({
                    variant: "default",
                    title: "Database Not Seeded",
                    description: result.message,
                });
            }
        }
        setIsSeeding(false);
        setLoading(false); // Ensure loading is false after seeding completes
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Menu Management</h1>
                    <p className="text-muted-foreground">Add, edit, or remove menu items.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => handleSeed(false)} variant="outline" disabled={isSeeding || loading}>
                        {isSeeding ? <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current mr-2" /> : <Sprout className="mr-2 h-4 w-4" />}
                        {isSeeding ? 'Seeding...' : 'Seed Menu'}
                    </Button>
                    <Button asChild>
                        <Link href="/admin/dashboard/add">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Item
                        </Link>
                    </Button>
                </div>
            </div>
            {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            ) : (
                <MenuItemsTable menuItems={menuItems} />
            )}
        </div>
    );
}
