
"use client";

import Link from 'next/link';
import { ShoppingCart, ChefHat, Menu as MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import CartDrawer from '@/components/cart/cart-drawer';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';

export default function Header() {
  const { cartCount } = useCart();
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/about', label: 'About Us' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <ChefHat className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">HubSafari</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setCartOpen(true)}>
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="sr-only">Open cart</span>
            </Button>

            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 p-4">
                    <Link href="/" className="mr-6 flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                        <ChefHat className="h-6 w-6 text-primary" />
                        <span className="font-bold font-headline text-lg">HubSafari</span>
                    </Link>
                    {navLinks.map(link => (
                      <Link key={link.href} href={link.href} className="transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                        {link.label}
                      </Link>
                    ))}
                </div>
              </SheetContent>
            </Sheet>

          </div>
        </div>
      </header>
      <CartDrawer isOpen={isCartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
