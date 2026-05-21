import React, { createContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { CartItem, Product, CartState } from '../types';
import { cartReducer, initialCartState } from '../types/cartReducer';
import { useAuth } from '../hooks/useAuth';
import { getUserCart, saveUserCart } from '../services/firestore';

interface CartContextType extends CartState {
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [isCartOpen, setCartOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  // 1. Load cart on user state change
  useEffect(() => {
    const loadCart = async () => {
      setIsInitialLoad(true);
      if (user) {
        // Logged in user: load from Firestore (with localStorage fallback inside getUserCart)
        try {
          const items = await getUserCart(user.uid);
          dispatch({ type: 'SET_CART', payload: items });
        } catch (error) {
          console.error('Error loading cloud cart:', error);
        }
      } else {
        // Guest user: load from guest localStorage
        const guestCartStr = localStorage.getItem('cyber_cart_guest');
        if (guestCartStr) {
          try {
            const items = JSON.parse(guestCartStr);
            dispatch({ type: 'SET_CART', payload: items });
          } catch (e) {
            console.error('Error parsing guest cart:', e);
            dispatch({ type: 'CLEAR_CART' });
          }
        } else {
          dispatch({ type: 'CLEAR_CART' });
        }
      }
      setIsInitialLoad(false);
    };

    loadCart();
  }, [user]);

  // 2. Persist cart changes to cloud/local
  useEffect(() => {
    if (isInitialLoad) return;

    const syncCart = async () => {
      if (user) {
        try {
          await saveUserCart(user.uid, state.items);
        } catch (error) {
          console.error('Error saving cloud cart:', error);
        }
      } else {
        localStorage.setItem('cyber_cart_guest', JSON.stringify(state.items));
      }
    };

    // Use a small debounce or direct sync since cart edits are low-frequency user actions
    syncCart();
  }, [state.items, user, isInitialLoad]);

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalAmount: state.totalAmount,
        totalItems: state.totalItems,
        isCartOpen,
        setCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartContext;
