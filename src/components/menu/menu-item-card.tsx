
"use client"
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { MenuItem } from '@/types';
import AddToCartButton from '@/components/cart/add-to-cart-button';
import { Button } from '@/components/ui/button';
import { Utensils, IndianRupee } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const restaurantPhoneNumber = process.env.NEXT_PUBLIC_RESTAURANT_PHONE_NUMBER;


  const handleDirectOrder = (selectedQuantity: 'half' | 'full') => {
      if (!restaurantPhoneNumber) {
          toast({ variant: 'destructive', title: "Error", description: "Restaurant's phone number is not configured." });
          return;
      }
      const price = selectedQuantity === 'half' && item.price.half ? item.price.half : item.price.full;
      const message = `Hi, I'd like to directly order: 1x ${item.name} (${selectedQuantity}) - ₹${price.toFixed(2)}`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${restaurantPhoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
  };

  const handleAddToCart = (selectedQuantity: 'half' | 'full') => {
    addToCart(item, selectedQuantity);
  }

  const renderPrice = () => {
    if (item.hasHalfQuantity && item.price.half) {
      return (
        <div className="text-lg font-bold text-primary flex items-center">
          <IndianRupee className="h-4 w-4 mr-1" />{item.price.half.toFixed(2)} (Half) / <IndianRupee className="h-4 w-4 mr-1 ml-2" />{item.price.full.toFixed(2)} (Full)
        </div>
      );
    }
    return (
      <div className="text-lg font-bold text-primary flex items-center">
        <IndianRupee className="h-4 w-4 mr-1" />{item.price.full.toFixed(2)}
      </div>
    );
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="aspect-[4/3] relative bg-muted flex items-center justify-center">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
             <Utensils className="h-16 w-16 text-muted-foreground/50" />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-headline mb-2">{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex flex-col items-start gap-4">
        {renderPrice()}
        <div className="flex w-full gap-2">
            {item.hasHalfQuantity ? (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="flex-1">Add to Cart</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleAddToCart('half')}>Half</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAddToCart('full')}>Full</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex-1">Order Now</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleDirectOrder('half')}>Half</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDirectOrder('full')}>Full</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            ) : (
                <>
                    <AddToCartButton item={item} selectedQuantity='full' className="flex-1" />
                    <Button variant="outline" onClick={() => handleDirectOrder('full')} className="flex-1">Order Now</Button>
                </>
            )}
        </div>
      </CardFooter>
    </Card>
  );
}
