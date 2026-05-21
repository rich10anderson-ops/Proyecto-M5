import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { productConverter } from "../firestore";
import type { Product } from "../../types";

//* Obtener todos los productos:
export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(
    collection(db, "products").withConverter(productConverter)
  );
  return snapshot.docs.map((doc) => doc.data());
};

//* Obtener un producto por ID:
export const getProductById = async (id: string): Promise<Product | null> => {
  const ref = doc(db, "products", id).withConverter(productConverter);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return snapshot.data();
};

//* Crear un nuevo producto:
type NewProduct = Omit<Product, "id">;

export const addProduct = async (product: NewProduct): Promise<string> => {
  // We cast to Product for the converter (id will be omitted in toFirestore)
  const productWithPlaceholderId = { id: "", ...product } as Product;
  const docRef = await addDoc(
    collection(db, "products").withConverter(productConverter),
    productWithPlaceholderId
  );
  return docRef.id;
};

//* Obtener productos por categoría ordenados por precio:
export const getProductsByCategory = async (
  category: string,
): Promise<Product[]> => {
  try {
    // Validación básica:
    if (!category.trim()) {
      return [];
    }

    let dbCategory = category;
    if (category === 'Zapatillas') dbCategory = 'shoes';
    if (category === 'Ropa') dbCategory = 'clothing';
    if (category === 'Accesorios') dbCategory = 'accessories';

    const isSeedCategory = dbCategory === 'shoes' || dbCategory === 'clothing' || dbCategory === 'accessories';
    const categoryField = isSeedCategory ? 'categoryId' : 'category';

    const productsRef = collection(db, "products").withConverter(productConverter);

    const productsQuery = query(
      productsRef,
      where(categoryField, "==", dbCategory),
      orderBy("price", "asc"),
    );

    const snapshot = await getDocs(productsQuery);

    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("[getProductsByCategory] Error fetching products:", error);
    throw new Error("Failed to fetch products by category");
  }
};

//* Modificar producto:
type UpdateProduct = Partial<Omit<Product, "id">>;

export const updateProduct = async (
  id: string,
  updates: UpdateProduct
): Promise<void> => {
  const ref = doc(db, "products", id);
  await updateDoc(ref, updates);
};

//* Eliminar producto por ID:
export const deleteProduct = async (id: string): Promise<void> => {
  const ref = doc(db, "products", id);
  await deleteDoc(ref);
};
