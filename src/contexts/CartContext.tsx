import React, { createContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { CartItem, Product, CartState } from '../types';
import { cartReducer, initialCartState } from '../types/cartReducer';
import { useAuth } from '../hooks/useAuth';
import { getUserCart, saveUserCart } from '../services/firebase/firestore';
import { CheckCircle, X } from 'lucide-react';

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
  const [cartToast, setCartToast] = useState<{ productName: string; visible: boolean }>({
    productName: '',
    visible: false,
  });

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
    setCartToast({ productName: product.name, visible: true });
  };

  useEffect(() => {
    if (!cartToast.visible) return;
    const timer = window.setTimeout(() => {
      setCartToast(prev => ({ ...prev, visible: false }));
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [cartToast.visible, cartToast.productName]);

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
    <>
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

      {cartToast.visible && (
        <div className="fixed top-20 right-4 z-[60] w-[min(92vw,360px)] overflow-hidden border border-cyber-cyan/50 bg-cyber-black shadow-[0_0_28px_rgba(0,240,255,0.22)] animate-slide-in">
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/20 via-cyber-pink/15 to-cyber-lime/20" />
          <div className="relative flex items-start gap-3 p-4">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-cyber-lime/60 bg-cyber-lime/10 text-cyber-lime shadow-neon-lime">
              <CheckCircle size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-xs font-black uppercase tracking-widest text-white">
                Producto agregado
              </p>
              <p className="mt-1 truncate font-mono text-[10px] uppercase text-cyber-light/70">
                {cartToast.productName}
              </p>
            </div>
            <button
              onClick={() => setCartToast(prev => ({ ...prev, visible: false }))}
              className="border border-transparent p-1 text-cyber-light/45 transition-colors hover:border-cyber-pink/40 hover:text-cyber-pink"
              aria-label="Cerrar alerta de carrito"
            >
              <X size={14} />
            </button>
          </div>
          <div className="relative h-0.5 bg-gradient-to-r from-cyber-cyan via-cyber-pink to-cyber-lime" />
        </div>
      )}
    </>
  );
};
export default CartContext;
