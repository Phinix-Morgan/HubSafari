"use client";

import { useEffect, useState, use } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MenuItem } from '@/types';
import MenuItemForm from '@/components/admin/menu-item-form';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  // `use` will unwrap the promise. This is the new way to handle params.
  const { id } = use(params);

  const [initialData, setInitialData] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const docRef = doc(db, 'menuItems', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setInitialData({ id: docSnap.id, ...docSnap.data() } as MenuItem);
          } else {
            setError('No such document!');
          }
        } catch (err) {
            setError('Failed to fetch item data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
      };
      fetchItem();
    }
  }, [id]);

  if (loading) {
    return (
        <Card>
            <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-1/2" />
            </CardContent>
        </Card>
    );
  }

  if (error) {
    return <p className="text-destructive">{error}</p>
  }

  return (
    <div>
      <MenuItemForm initialData={initialData} />
    </div>
  );
}
