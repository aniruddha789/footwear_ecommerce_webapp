import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/Product';

interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (productId: number, size: string, color: string) => void;
  updateQuantity: (productId: number, size: string, color: string, quantity: number) => void;
  updateSize: (productId: number, oldSize: string, color: string, newSize: string) => void;
  getCartCount: () => number;
  clearCart: () => void;
  onCartUpdate: (callback: () => void) => () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Initialize state from localStorage
    const savedItems = localStorage.getItem('cartItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  const [updateCallbacks, setUpdateCallbacks] = useState<(() => void)[]>([]);

  const onCartUpdate = (callback: () => void) => {
    setUpdateCallbacks(prev => [...prev, callback]);
    return () => {
      setUpdateCallbacks(prev => prev.filter(cb => cb !== callback));
    };
  };

  const notifyCartUpdate = () => {
    updateCallbacks.forEach(callback => callback());
  };

  // Update localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
    notifyCartUpdate();
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
      return [...prevItems, { 
        product, 
        quantity: 1, 
        selectedSize: size, 
        selectedColor: color,
        image: product.inventory?.find(inv => inv.color === color)?.image || product.image || '' // Add optional chaining and empty string fallback
      }];
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
        (item.product.id === productId && 
         item.selectedSize === size && 
         item.selectedColor === color)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateSize = (productId: number, oldSize: string, color: string, newSize: string) => {
    setItems(prevItems => {
      // Find the item being updated
      const itemToUpdate = prevItems.find(
        item => item.product.id === productId && 
                item.selectedSize === oldSize && 
                item.selectedColor === color
      );

      if (!itemToUpdate) return prevItems;

      // Find if there's already an item with the new size
      const existingItemWithNewSize = prevItems.find(
        item => item.product.id === productId && 
                item.selectedSize === newSize && 
                item.selectedColor === color
      );

      if (existingItemWithNewSize) {
        // Combine quantities and remove the old item
        return prevItems
          .map(item => {
            if (item === existingItemWithNewSize) {
              // Add quantities together
              return { ...item, quantity: item.quantity + itemToUpdate.quantity };
            }
            return item;
          })
          .filter(item => !(
            item.product.id === productId && 
            item.selectedSize === oldSize && 
            item.selectedColor === color
          ));
      }

      // If no existing item with new size, just update the size
      return prevItems.map(item =>
        (item.product.id === productId && 
         item.selectedSize === oldSize && 
         item.selectedColor === color)
          ? { ...item, selectedSize: newSize }
          : item
      );
    });
  };

  const getCartCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      updateSize, 
      getCartCount,
      clearCart,
      onCartUpdate
    }}>
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