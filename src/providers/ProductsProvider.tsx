import { ProductContext } from "../contexts/ProductContext";

interface Props {
  children: React.ReactNode;
}

export const ProductsProvider = ({ children }: Props) => {
  return (
    <ProductContext.Provider value={{ products: [], loading: false, error: null, category: 'Todos', search: '', totalProducts: 0, hasMore: false, loadProducts: async () => {}, changeCategory: () => {}, changeSearch: () => {}, loadNextPage: () => {}, fetchProductById: async () => null, addReviewToProduct: async () => {}, refreshCatalog: () => {} }}>
      {children}
    </ProductContext.Provider>
  );
};
