import React, { createContext, useContext, useState } from 'react';
import { Product } from '../types/Product';
import { getCart, updateItemQuantity } from '../services/api';

interface CartItem {
  itemId: number;
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
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  updateSize: (productId: number, oldSize: string, color: string, newSize: string) => void;
  getCartCount: () => number;
  clearCart: () => void;
  onCartUpdate: (callback: () => void) => () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
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

  const refreshCart = async () => {
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        setItems([]);
        return;
      }
      const cart = await getCart(username);
      const cartItems: CartItem[] = cart.orderItems.map(item => ({
        itemId: item.id,
        product: item.product,
        quantity: item.quantity,
        selectedSize: item.size,
        selectedColor: item.color,
        image: item.product.image || ''
      }));
      setItems(cartItems);
      notifyCartUpdate();
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = (product: Product, size: string, color: string) => {
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
      return [...prevItems, { 
        itemId: 0,
        product, 
        quantity: 1, 
        selectedSize: size, 
        selectedColor: color,
        image: product.inventory?.find(inv => inv.color === color)?.image || product.image || ''
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

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        console.error('No username found');
        return;
      }

      // Call the backend API directly with the itemId
      const updatedCart = await updateItemQuantity(username, itemId, quantity);
      
      // Update local state with the new cart data
      const cartItems: CartItem[] = updatedCart.orderItems.map(item => ({
        itemId: item.id,
        product: item.product,
        quantity: item.quantity,
        selectedSize: item.size,
        selectedColor: item.color,
        image: item.product.image || ''
      }));
      
      setItems(cartItems);
      notifyCartUpdate();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const updateSize = (productId: number, oldSize: string, color: string, newSize: string) => {
    setItems(prevItems => {
      const itemToUpdate = prevItems.find(
        item => item.product.id === productId && 
                item.selectedSize === oldSize && 
                item.selectedColor === color
      );

      if (!itemToUpdate) return prevItems;

      const existingItemWithNewSize = prevItems.find(
        item => item.product.id === productId && 
                item.selectedSize === newSize && 
                item.selectedColor === color
      );

      if (existingItemWithNewSize) {
        return prevItems
          .map(item => {
            if (item === existingItemWithNewSize) {
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
      onCartUpdate,
      refreshCart
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