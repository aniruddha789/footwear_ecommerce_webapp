import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/Product';

interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (productId: number, size: string, color: string) => void;
  updateQuantity: (productId: number, size: string, color: string, quantity: number) => void;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Initialize state from localStorage
    const savedItems = localStorage.getItem('cartItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  // Update localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, size: string, color: string) => {
    console.log("Current cart: " + items.map(item => item.product.name + "_" + item.quantity + "_" + item.selectedColor + "_" + item.selectedSize))
    setItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.product.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color
      );

      if (existingItem) {
        return prevItems.map(item =>
          item === existingItem
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      console.log("Added to cart!")
      return [...prevItems, { product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
  };

  const removeFromCart = (productId: number, size: string, color: string) => {
    setItems(prevItems => prevItems.filter(item => 
      !(item.product.id === productId && 
        item.selectedSize === size && 
        item.selectedColor === color)
    ));
  };

  const updateQuantity = (productId: number, size: string, color: string, quantity: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        (item.product.id === productId && item.selectedColor === color)
          ? { ...item, quantity, selectedSize: size }
          : item
      )
    );
  };

  const getCartCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 