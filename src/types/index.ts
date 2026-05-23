import { Product } from "./product";

export type UserRole = 'customer' | 'admin'|'invitado';

export type AuthUser = {
  uid: string;
  email: string;
  role: UserRole;
};

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export * from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderProductSnapshot {
  productId: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface ShippingDetails {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: CartItem[];
  productSnapshots?: OrderProductSnapshot[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  shippingDetails: ShippingDetails;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}
