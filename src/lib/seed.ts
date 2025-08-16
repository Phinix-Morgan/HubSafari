
'use server';

import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

const menuItems = [
    {
        name: 'Margherita Pizza',
        description: 'Classic pizza with fresh mozzarella, tomatoes, and basil on a crispy crust.',
        price: 12.99,
        category: 'Main Courses',
        imageUrl: 'https://placehold.co/600x400.png?text=Margherita+Pizza',
        isAvailable: true,
    },
    {
        name: 'Spaghetti Carbonara',
        description: 'A classic Roman pasta dish with eggs, cheese, pancetta, and black pepper.',
        price: 15.50,
        category: 'Main Courses',
        imageUrl: 'https://placehold.co/600x400.png?text=Spaghetti+Carbonara',
        isAvailable: true,
    },
    {
        name: 'Bruschetta',
        description: 'Grilled bread topped with fresh tomatoes, garlic, basil, and olive oil.',
        price: 7.99,
        category: 'Appetizers',
        imageUrl: 'https://placehold.co/600x400.png?text=Bruschetta',
        isAvailable: true,
    },
    {
        name: 'Caesar Salad',
        description: 'Crisp romaine lettuce with Caesar dressing, croutons, and Parmesan cheese.',
        price: 9.50,
        category: 'Appetizers',
        imageUrl: 'https://placehold.co/600x400.png?text=Caesar+Salad',
        isAvailable: true,
    },
    {
        name: 'Tiramisu',
        description: 'A coffee-flavored Italian dessert with ladyfingers, mascarpone, and cocoa.',
        price: 8.00,
        category: 'Desserts',
        imageUrl: 'https://placehold.co/600x400.png?text=Tiramisu',
        isAvailable: true,
    },
    {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a molten chocolate center, served with vanilla ice cream.',
        price: 8.50,
        category: 'Desserts',
        imageUrl: 'https://placehold.co/600x400.png?text=Chocolate+Lava+Cake',
        isAvailable: true,
    },
    {
        name: 'Lemonade',
        description: 'Freshly squeezed lemonade, perfect for a sunny day.',
        price: 3.50,
        category: 'Drinks',
        imageUrl: 'https://placehold.co/600x400.png?text=Lemonade',
        isAvailable: true,
    },
    {
        name: 'Iced Tea',
        description: 'Freshly brewed iced tea, served with a lemon wedge.',
        price: 3.00,
        category: 'Drinks',
        imageUrl: 'https://placehold.co/600x400.png?text=Iced+Tea',
        isAvailable: true,
    },
];

export async function seedDatabase() {
  const menuItemsCollection = collection(db, 'menuItems');
  
  // Check if the collection is empty
  const snapshot = await getDocs(menuItemsCollection);
  if (snapshot.empty) {
    console.log('Menu items collection is empty. Seeding database...');
    const batch = writeBatch(db);
    menuItems.forEach(item => {
      const docRef = collection(db, 'menuItems').doc(); // Auto-generates an ID
      batch.set(docRef, item);
    });
    await batch.commit();
    console.log('Database seeded successfully!');
    return { success: true, message: "Database seeded successfully."};
  } else {
    console.log('Menu items collection is not empty. Skipping seeding.');
    return { success: false, message: "Database already contains data."};
  }
}
