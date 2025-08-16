
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, query, where, onSnapshot } from 'firebase/firestore';
import type { MenuItem } from '@/types';
import MenuItemCard from '@/components/menu/menu-item-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { seedDatabase } from '@/lib/seed';

function HeroSection() {
  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
      <Image
        // Add your image to the `public/images` folder and reference it here.
        src="/images/hero-background.jpg"
        alt="A delicious looking pizza on a rustic wooden table"
        data-ai-hint="gourmet pizza"
        fill
        className="object-cover brightness-50"
        priority
      />
      <div className="relative z-10 p-4">
        <h1 className="text-4xl md:text-7xl font-headline mb-4 drop-shadow-lg">
          Authentic Flavors, Modern Twist
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-md">
          Discover a culinary experience where traditional recipes meet contemporary innovation.
        </p>
        <Button asChild size="lg" className="text-lg py-6 px-8">
          <Link href="/menu">View Menu</Link>
        </Button>
      </div>
    </section>
  );
}

function FeaturedItemsSection() {
    const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'menuItems'), 
            where("isAvailable", "==", true),
            where("isFeatured", "==", true), 
            limit(4)
        );
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
            setFeaturedItems(items);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching featured items: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <section className="py-16 md:py-24 bg-secondary">
            <div className="container">
                <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Featured Dishes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                           <Card key={index}><CardContent className="p-4 space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-10 w-full" /></CardContent></Card>
                        ))
                    ) : (
                        featuredItems.map(item => <MenuItemCard key={item.id} item={item} />)
                    )}
                </div>
            </div>
        </section>
    );
}

function AboutSnippet() {
    return (
        <section className="py-16 md:py-24">
            <div className="container">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="aspect-video relative rounded-lg overflow-hidden shadow-lg">
                         <Image src="https://placehold.co/600x400.png" data-ai-hint="modern restaurant" alt="The warm and inviting interior of a modern restaurant" fill className="object-cover" />
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-headline mb-4">Our Story</h2>
                        <p className="text-muted-foreground mb-6">
                            From a humble kitchen to a beloved local eatery, Flavors Express has always been about one thing: sharing our passion for food. We believe in fresh ingredients, bold flavors, and a warm, welcoming atmosphere.
                        </p>
                        <Button asChild variant="outline">
                            <Link href="/about">Read More</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

function TestimonialsSection() {
    const testimonials = [
        { name: "Sarah J.", quote: "Absolutely the best meal I've had in ages! The attention to detail is stunning.", avatar: "https://placehold.co/100x100.png", dataAiHint: "happy woman" },
        { name: "Mike R.", quote: "A hidden gem! The atmosphere is cozy and the food is out of this world. Highly recommended.", avatar: "https://placehold.co/100x100.png", dataAiHint: "smiling man" },
        { name: "Emily C.", quote: "I can't get enough of their desserts. A perfect end to a perfect meal every single time.", avatar: "https://placehold.co/100x100.png", dataAiHint: "delighted person" },
    ];
    return (
        <section className="py-16 md:py-24 bg-secondary">
            <div className="container">
                <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">What Our Guests Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <Card key={i}>
                            <CardContent className="p-6 text-center">
                                <p className="text-muted-foreground mb-4 italic">"{t.quote}"</p>
                                <div className="flex items-center justify-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={t.avatar} alt={t.name} data-ai-hint={t.dataAiHint} />
                                        <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-semibold">{t.name}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedItemsSection />
      <AboutSnippet />
      <TestimonialsSection />
    </>
  );
}
