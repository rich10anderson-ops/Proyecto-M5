import { createContext } from "react";
import type { Product } from "./product";
import type { CartItem } from "./cart.types";
export type CartContextType = {
  items: CartItem[];

  addItem: (product: Product) => void;

  removeItem: (id: string) => void;

  clearCart: () => void;
};

export const CartContext = createContext<CartContextType | null>(null);
