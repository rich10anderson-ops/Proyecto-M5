import { ProductContext } from "../contexts/ProductContext";

interface Props {
  children: React.ReactNode;
}

export const ProductsProvider = ({ children }: Props) => {
  return (
    <ProductContext.Provider value={undefined}>{children}</ProductContext.Provider>
  );
};
