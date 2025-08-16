export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
};

export type CartItem = MenuItem & {
  quantity: number;
};
