
"use client";

import Image from 'next/image';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, X, Utensils } from 'lucide-react';
import { Badge } from '../ui/badge';

interface CartDrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function CartDrawer({ isOpen, onOpenChange }: CartDrawerProps) {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const restaurantPhoneNumber = process.env.NEXT_PUBLIC_RESTAURANT_PHONE_NUMBER;

  const handleOrderNow = () => {
    if (!restaurantPhoneNumber) {
        alert("Restaurant's phone number is not configured. Please contact support.");
        return;
    }

    const orderSummary = cartItems.map(item => `- ${item.quantity}x ${item.name} (${item.selectedQuantity})`).join('\n');
    const message = `Hi, I'd like to order:\n${orderSummary}\n\nTotal: ₹${cartTotal.toFixed(2)}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${restaurantPhoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    clearCart();
    onOpenChange(false);
  };

  const getItemPrice = (item: (typeof cartItems)[0]) => {
    return item.selectedQuantity === 'half' && item.price.half ? item.price.half : item.price.full;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 p-6">
                {cartItems.map(item => (
                  <div key={item.id + item.selectedQuantity} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center relative">
                        {item.imageUrl ? (
                            <Image src={item.imageUrl} alt={item.name} fill className="rounded-md object-cover" />
                        ) : (
                            <Utensils className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{item.name} <Badge variant="outline" className="capitalize">{item.selectedQuantity}</Badge></p>
                        <p className="text-sm text-muted-foreground">₹{getItemPrice(item).toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.selectedQuantity, item.quantity - 1)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.selectedQuantity, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id, item.selectedQuantity)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="p-6 bg-secondary">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <Button className="w-full" onClick={handleOrderNow}>
                  Order on WhatsApp
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <p className="text-muted-foreground">Your cart is empty.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
