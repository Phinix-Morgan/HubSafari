"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MenuItem } from '@/types';
import MenuItemCard from '@/components/menu/menu-item-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const menuItemsCollection = collection(db, 'menuItems');
        const q = query(menuItemsCollection, where("isAvailable", "==", true));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
        
        const uniqueCategories = ["All", ...Array.from(new Set(items.map(item => item.category)))];
        
        setMenuItems(items);
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching menu items: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, index) => (
         <Card key={index}><CardContent className="p-4 space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-10 w-32" /></CardContent></Card>
      ))}
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
      ) : (
        <Tabs defaultValue="All" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-8">
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
