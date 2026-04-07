'use client';

import * as React from 'react';
import { Card } from '@/components/Card';
import { CountdownTimer } from '@/components/CountdownTimer';
import { useCartStore } from '@/store/cartStore';
import { useUiStore } from '@/store/uiStore';
import { MenuItem } from '@/types/menu';
import { ShoppingBag } from 'lucide-react';

// Mock Data for MVP
const MOCK_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Jollof Rice & Grilled Chicken',
    description: 'Spicy Nigerian party jollof served with perfectly grilled chicken and plantain.',
    price: 4500,
    imageUrl: '/images/jollof.jpg',
    stock: 15,
    maxStock: 50,
    isSoldOut: false,
    category: 'meal',
  },
  {
    id: '2',
    name: 'Pounded Yam & Egusi',
    description: 'Smooth pounded yam with rich egusi soup and assorted meat.',
    price: 5000,
    imageUrl: '/images/egusi.jpg',
    stock: 5,
    maxStock: 30,
    isSoldOut: false,
    category: 'meal',
  },
  {
    id: '3',
    name: 'Fried Rice & Turkey',
    description: 'Stir-fried rice with mixed vegetables and crispy fried turkey.',
    price: 4800,
    imageUrl: '/images/fried-rice.jpg',
    stock: 0,
    maxStock: 40,
    isSoldOut: true,
    category: 'meal',
  },
  {
    id: '4',
    name: 'Chilled Zobo Drink',
    description: 'Refreshing hibiscus drink with pineapple and ginger notes.',
    price: 1000,
    imageUrl: '/images/zobo.jpg',
    stock: 45,
    maxStock: 100,
    isSoldOut: false,
    category: 'drink',
  }
];

export default function Home() {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUiStore((state) => state.openCart);

  // Set next order window (e.g. 2 hours from now for demo)
  const [targetDate, setTargetDate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const nextWindow = new Date();
    nextWindow.setHours(nextWindow.getHours() + 2);
    setTargetDate(nextWindow);
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    openCart(); // Show cart when item added
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-background text-foreground dark:bg-secondary dark:text-secondary-foreground py-20 px-4 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary rounded-full blur-3xl opacity-15 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent rounded-full blur-3xl opacity-15 pointer-events-none" />
        
        <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Order Your Daily Meals. <br className="hidden md:block" />
            <span className="text-primary">Guaranteed Delivery.</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/75 dark:text-secondary-foreground/80 max-w-2xl mb-10">
            Skip the wait. Order your food during our active window and get it delivered hot and fresh in your preferred time slot.
          </p>
          
          <div className="bg-background/70 dark:bg-secondary-light/20 backdrop-blur-md border border-secondary-light/20 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            {targetDate && (
              <CountdownTimer targetDate={targetDate} />
            )}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-16 px-4 bg-secondary-light/5 flex-1">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black text-foreground">Today&apos;s Menu</h2>
              <p className="text-foreground/60 mt-2 font-medium">Freshly prepared, limited portions.</p>
            </div>
            
            <div className="flex items-center gap-2 text-sm font-semibold bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20">
              <ShoppingBag size={16} />
              Order window closes soon
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MOCK_MENU.map((item) => (
              <Card 
                key={item.id} 
                item={item} 
                onAddToCart={handleAddToCart} 
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
