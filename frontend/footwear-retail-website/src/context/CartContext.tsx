import React, { createContext, useContext, useState } from 'react';
import { Product } from '../types/Product';
import { getCart, updateItemQuantity, removeItemFromCart, updateItemSize } from '../services/api';

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
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  updateSize: (itemId: number, newSize: string) => Promise<void>;
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
        image: item.product.inventory?.find(inv => inv.color === item.color)?.image || item.product.image || ''
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
    
    notifyCartUpdate();
  };

  const removeFromCart = async (itemId: number) => {
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        console.error('No username found');
        return;
      }

      // Call the backend API with the itemId
      const updatedCart = await removeItemFromCart(username, itemId);
      
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
      console.error('Error removing item from cart:', error);
    }
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

  const updateSize = async (itemId: number, newSize: string) => {
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        console.error('No username found');
        return;
      }

      // Call the backend API with the itemId and new size
      const updatedCart = await updateItemSize(username, itemId, newSize);
      
      // Update local state with the new cart data
      const cartItems: CartItem[] = updatedCart.orderItems.map(item => ({
        itemId: item.id,
        product: item.product,
        quantity: item.quantity,
        selectedSize: item.size,
        selectedColor: item.color,
        image: item.product.inventory?.find(inv => inv.color === item.color)?.image || item.product.image || ''
      }));
      
      setItems(cartItems);
      notifyCartUpdate();
    } catch (error) {
      console.error('Error updating size:', error);
    }
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