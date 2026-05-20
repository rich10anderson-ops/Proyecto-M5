import { describe, it, expect } from 'vitest';
import { cartReducer, initialCartState } from '../contexts/cartReducer';
import { Product, CartState } from '../types';

const MOCK_PRODUCT_A: Product = {
  id: 'prod-a',
  name: 'CYBER-HOODIE // SHIELD v1',
  description: 'streetwear buzo',
  price: 100,
  category: 'Vestimenta',
  imageUrl: 'https://images.unsplash.com/...',
  stock: 5,
  createdAt: new Date().toISOString(),
};

const MOCK_PRODUCT_B: Product = {
  id: 'prod-b',
  name: 'AUDIO PODS // ECLIPSE ANC',
  description: 'cyberbuds',
  price: 50,
  category: 'Audio',
  imageUrl: 'https://images.unsplash.com/...',
  stock: 2,
  createdAt: new Date().toISOString(),
};

describe('cartReducer Unit Tests', () => {
  it('should return initial state by default', () => {
    // @ts-ignore
    const state = cartReducer(initialCartState, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialCartState);
  });

  it('should handle ADD_ITEM', () => {
    // Add product A
    let state = cartReducer(initialCartState, { type: 'ADD_ITEM', payload: MOCK_PRODUCT_A });
    expect(state.items.length).toBe(1);
    expect(state.items[0].product.id).toBe('prod-a');
    expect(state.items[0].quantity).toBe(1);
    expect(state.totalAmount).toBe(100);
    expect(state.totalItems).toBe(1);

    // Add product A again (increments quantity)
    state = cartReducer(state, { type: 'ADD_ITEM', payload: MOCK_PRODUCT_A });
    expect(state.items[0].quantity).toBe(2);
    expect(state.totalAmount).toBe(200);
    expect(state.totalItems).toBe(2);

    // Add product B
    state = cartReducer(state, { type: 'ADD_ITEM', payload: MOCK_PRODUCT_B });
    expect(state.items.length).toBe(2);
    expect(state.totalAmount).toBe(250);
    expect(state.totalItems).toBe(3);
  });

  it('should respect stock limit on ADD_ITEM', () => {
    let state = initialCartState;
    // B has stock = 2. Let's try adding it 4 times.
    state = cartReducer(state, { type: 'ADD_ITEM', payload: MOCK_PRODUCT_B });
    state = cartReducer(state, { type: 'ADD_ITEM', payload: MOCK_PRODUCT_B });
    state = cartReducer(state, { type: 'ADD_ITEM', payload: MOCK_PRODUCT_B });
    state = cartReducer(state, { type: 'ADD_ITEM', payload: MOCK_PRODUCT_B });

    expect(state.items[0].quantity).toBe(2); // Capped at 2
    expect(state.totalAmount).toBe(100);
    expect(state.totalItems).toBe(2);
  });

  it('should handle REMOVE_ITEM', () => {
    // Add A and B
    let state = cartReducer(initialCartState, { type: 'ADD_ITEM', payload: MOCK_PRODUCT_A });
    state = cartReducer(state, { type: 'ADD_ITEM', payload: MOCK_PRODUCT_B });

    expect(state.items.length).toBe(2);

    // Remove A
    state = cartReducer(state, { type: 'REMOVE_ITEM', payload: 'prod-a' });
    expect(state.items.length).toBe(1);
    expect(state.items[0].product.id).toBe('prod-b');
    expect(state.totalAmount).toBe(50);
    expect(state.totalItems).toBe(1);
  });

  it('should handle UPDATE_QUANTITY', () => {
    let state = cartReducer(initialCartState, { type: 'ADD_ITEM', payload: MOCK_PRODUCT_A });
    
    // Update quantity of A to 3
    state = cartReducer(state, { 
      type: 'UPDATE_QUANTITY', 
      payload: { productId: 'prod-a', quantity: 3 } 
    });
    expect(state.items[0].quantity).toBe(3);
    expect(state.totalAmount).toBe(300);

    // Update quantity of A exceeding stock limit (stock = 5)
    state = cartReducer(state, { 
      type: 'UPDATE_QUANTITY', 
      payload: { productId: 'prod-a', quantity: 10 } 
    });
    expect(state.items[0].quantity).toBe(5); // Capped at 5
    expect(state.totalAmount).toBe(500);

    // Update quantity of A to 0 (should remove item)
    state = cartReducer(state, { 
      type: 'UPDATE_QUANTITY', 
      payload: { productId: 'prod-a', quantity: 0 } 
    });
    expect(state.items.length).toBe(0);
    expect(state.totalAmount).toBe(0);
  });

  it('should handle CLEAR_CART', () => {
    let state = cartReducer(initialCartState, { type: 'ADD_ITEM', payload: MOCK_PRODUCT_A });
    state = cartReducer(state, { type: 'CLEAR_CART' });
    expect(state).toEqual(initialCartState);
  });

  it('should handle SET_CART', () => {
    const payload = [
      { product: MOCK_PRODUCT_A, quantity: 2 },
      { product: MOCK_PRODUCT_B, quantity: 1 }
    ];
    const state = cartReducer(initialCartState, { type: 'SET_CART', payload });
    expect(state.items.length).toBe(2);
    expect(state.totalItems).toBe(3);
    expect(state.totalAmount).toBe(250);
  });
});
