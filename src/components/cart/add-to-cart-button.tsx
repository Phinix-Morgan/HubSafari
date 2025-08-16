"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import type { MenuItem } from "@/types";
import { ShoppingCart } from "lucide-react";
import type { ComponentProps } from "react";

interface AddToCartButtonProps extends ComponentProps<typeof Button> {
  item: MenuItem;
}

export default function AddToCartButton({ item, children, ...props }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  return (
    <Button onClick={() => addToCart(item)} {...props}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      {children || "Add to Cart"}
    </Button>
  );
}
