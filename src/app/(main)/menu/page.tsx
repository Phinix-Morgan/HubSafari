
"use client";

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MenuItem } from '@/types';
import MenuItemCard from '@/components/menu/menu-item-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Utensils } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const menuItemsCollection = collection(db, 'menuItems');
    
    const unsubscribe = onSnapshot(menuItemsCollection, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      const availableItems = items.filter(item => item.isAvailable);
      
      if (availableItems.length > 0) {
        const uniqueCategories = ["All", ...Array.from(new Set(availableItems.map(item => item.category)))];
        setCategories(uniqueCategories);
      } else {
        setCategories([]);
      }
      
      setMenuItems(availableItems);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching menu items: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, index) => (
         <Card key={index}><CardContent className="p-4 space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-10 w-32" /></CardContent></Card>
      ))}
    </div>
  );
  
  const renderEmptyState = () => (
    <div className="text-center py-16 bg-secondary rounded-lg">
        <Utensils className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-headline">Our Menu is Currently Empty</h2>
        <p className="mt-2 text-muted-foreground">The chef is busy preparing new dishes. Please check back later!</p>
        <p className="mt-1 text-sm text-muted-foreground">If you're the admin, please add items through the <Link href="/admin/dashboard" className="underline hover:text-primary">dashboard</Link>.</p>
    </div>
  );


  return (
    <div className="container py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-headline text-center mb-4">Our Menu</h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Explore our wide range of dishes, from savory appetizers to decadent desserts, all prepared with the freshest ingredients.</p>
      
      {loading ? (
        <>
            <div className="flex justify-center mb-8"><Skeleton className="h-10 w-96" /></div>
            {renderSkeletons()}
        </>
      ) : menuItems.length === 0 ? (
        renderEmptyState()
      ) : (
        <Tabs defaultValue="All" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-8">
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {menuItems
                  .filter(item => category === 'All' || item.category === category)
                  .map(item => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
