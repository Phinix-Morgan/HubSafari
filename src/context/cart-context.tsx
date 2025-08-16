
"use client";

import type { ReactNode } from 'react';
import { createContext, useState, useEffect } from 'react';
import type { CartItem, MenuItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem, selectedQuantity: 'half' | 'full') => void;
  updateQuantity: (itemId: string, selectedQuantity: 'half' | 'full', quantity: number) => void;
  removeFromCart: (itemId: string, selectedQuantity: 'half' | 'full') => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: MenuItem, selectedQuantity: 'half' | 'full') => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id && i.selectedQuantity === selectedQuantity);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id && i.selectedQuantity === selectedQuantity ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1, selectedQuantity }];
    });
    toast({
      title: "Added to cart",
      description: `${item.name} (${selectedQuantity}) is now in your cart.`,
    });
  };

  const updateQuantity = (itemId: string, selectedQuantity: 'half' | 'full', quantity: number) => {
    setCartItems(prevItems => {
      if (quantity <= 0) {
        return prevItems.filter(i => !(i.id === itemId && i.selectedQuantity === selectedQuantity));
      }
      return prevItems.map(i =>
        i.id === itemId && i.selectedQuantity === selectedQuantity ? { ...i, quantity } : i
      );
    });
  };

  const removeFromCart = (itemId: string, selectedQuantity: 'half' | 'full') => {
    setCartItems(prevItems => prevItems.filter(i => !(i.id === itemId && i.selectedQuantity === selectedQuantity)));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => {
    const price = item.selectedQuantity === 'half' && item.price.half ? item.price.half : item.price.full;
    return acc + price * item.quantity
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
