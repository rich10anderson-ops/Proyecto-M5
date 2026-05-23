import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { CartProvider } from "./CartProvider";
import { ProductsProvider } from "./ProductsProvider";

interface Props {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: Props) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>{children}</CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
