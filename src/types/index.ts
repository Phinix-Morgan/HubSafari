export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string; // Made optional
  isAvailable: boolean;
};

export type CartItem = MenuItem & {
  quantity: number;
};
