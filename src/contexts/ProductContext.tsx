import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, Review } from '../types';
import { getProducts, getProductById, addReview as addReviewService } from '../services/firestore';
import { useAuth } from '../hooks/useAuth';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  category: string;
  search: string;
  totalProducts: number;
  hasMore: boolean;
  loadProducts: (reset?: boolean) => Promise<void>;
  changeCategory: (category: string) => void;
  changeSearch: (search: string) => void;
  loadNextPage: () => void;
  fetchProductById: (id: string) => Promise<Product | null>;
  addReviewToProduct: (productId: string, rating: number, comment: string) => Promise<void>;
  refreshCatalog: () => void;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('Todos');
  const [search, setSearch] = useState<string>('');
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  const { profile } = useAuth();

  const loadProducts = useCallback(async (reset: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const currentLastDoc = reset ? null : lastDoc;
      const { products: loadedProducts, lastDoc: nextLastDoc, totalCount } = await getProducts(
        category,
        search,
        12, // 12 items per page as requested by user
        currentLastDoc
      );

      setTotalProducts(totalCount);
      
      if (reset) {
        setProducts(loadedProducts);
      } else {
        setProducts(prev => {
          // Avoid duplicate keys
          const existingIds = new Set(prev.map(p => p.id));
          const filtered = loadedProducts.filter(p => !existingIds.has(p.id));
          return [...prev, ...filtered];
        });
      }

      setLastDoc(nextLastDoc);
      
      // Determine if there are more items to load
      if (reset) {
        setHasMore(loadedProducts.length >= 12 && loadedProducts.length < totalCount);
      } else {
        setProducts(current => {
          setHasMore(current.length < totalCount && loadedProducts.length >= 12);
          return current;
        });
      }
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar el catálogo de productos.');
    } finally {
      setLoading(false);
    }
  }, [category, search, lastDoc]);

  // Load initial products or when filters change
  useEffect(() => {
    loadProducts(true);
  }, [category, search]);

  const changeCategory = (newCategory: string) => {
    setCategory(newCategory);
    setLastDoc(null);
  };

  const changeSearch = (newSearch: string) => {
    setSearch(newSearch);
    setLastDoc(null);
  };

  const loadNextPage = () => {
    if (!loading && hasMore) {
      loadProducts(false);
    }
  };

  const fetchProductById = async (id: string): Promise<Product | null> => {
    try {
      return await getProductById(id);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const addReviewToProduct = async (productId: string, rating: number, comment: string) => {
    if (!profile) throw new Error('Debes iniciar sesión para calificar un producto.');
    
    try {
      await addReviewService(productId, {
        userId: profile.uid,
        userName: profile.name,
        rating,
        comment
      });
      // Sincronizar catálogo para actualizar el rating en la interfaz
      setProducts(prev => 
        prev.map(p => {
          if (p.id === productId) {
            const currentTotal = p.totalReviews || 0;
            const currentRating = p.averageRating || 5.0;
            const newTotal = currentTotal + 1;
            const newRating = parseFloat(((currentRating * currentTotal + rating) / newTotal).toFixed(1));
            return {
              ...p,
              totalReviews: newTotal,
              averageRating: newRating
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.error(err);
      throw new Error('Error al registrar tu calificación.');
    }
  };

  const refreshCatalog = () => {
    loadProducts(true);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        category,
        search,
        totalProducts,
        hasMore,
        loadProducts,
        changeCategory,
        changeSearch,
        loadNextPage,
        fetchProductById,
        addReviewToProduct,
        refreshCatalog
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
export default ProductContext;
