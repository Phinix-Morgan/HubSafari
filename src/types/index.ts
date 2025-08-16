export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: {
    half?: number;
    full: number;
  };
  hasHalfQuantity: boolean;
  isFeatured: boolean;
  imageUrl?: string;
  isAvailable: boolean;
};

export type CartItem = MenuItem & {
  quantity: number;
  selectedQuantity: 'half' | 'full';
};
