import { CartContext } from "../contexts/CartContext";

interface Props {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: Props) => {
  return <CartContext.Provider value={undefined}>{children}</CartContext.Provider>;
};
