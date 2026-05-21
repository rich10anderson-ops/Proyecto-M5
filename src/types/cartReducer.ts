import { CartState, CartItem, Product } from '../types';

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string } // productId
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] };

export const initialCartState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = parseFloat(
    items.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2)
  );
  return { totalItems, totalAmount };
};

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const product = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        newItems = state.items.map((item, idx) => {
          if (idx === existingItemIndex) {
            // Respect product stock limits
            const newQty = Math.min(item.quantity + 1, product.stock);
            return { ...item, quantity: newQty };
          }
          return item;
        });
      } else {
        newItems = [...state.items, { product, quantity: 1 }];
      }

      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case 'REMOVE_ITEM': {
      const productId = action.payload;
      const newItems = state.items.filter((item) => item.product.id !== productId);
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        // Equivalent to removing the item
        const newItems = state.items.filter((item) => item.product.id !== productId);
        const totals = calculateTotals(newItems);
        return {
          ...state,
          items: newItems,
          ...totals,
        };
      }

      const newItems = state.items.map((item) => {
        if (item.product.id === productId) {
          // Respect product stock limits
          const newQty = Math.min(quantity, item.product.stock);
          return { ...item, quantity: newQty };
        }
        return item;
      });

      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case 'CLEAR_CART': {
      return initialCartState;
    }

    case 'SET_CART': {
      const items = action.payload;
      const totals = calculateTotals(items);
      return {
        ...state,
        items,
        ...totals,
      };
    }

    default:
      return state;
  }
};
