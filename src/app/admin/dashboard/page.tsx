"use client";

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MenuItem } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import MenuItemsTable from '@/components/admin/menu-items-table';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'menuItems'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const items: MenuItem[] = [];
            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() } as MenuItem);
            });
            setMenuItems(items);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching menu items: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Menu Management</h1>
                    <p className="text-muted-foreground">Add, edit, or remove menu items.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/dashboard/add">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Item
                    </Link>
                </Button>
            </div>
            {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ) : (
                <MenuItemsTable menuItems={menuItems} />
            )}
        </div>
    );
}
