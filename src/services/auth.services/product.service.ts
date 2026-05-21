import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Product } from "../../types";

//* Obtener todos los productos:
export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map(mapProduct);
};

//* Obtener un producto por ID:
export const getProductById = async (id: string): Promise<Product | null> => {
  const ref = doc(db, "products", id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  const data = snapshot.data() as unknown as Omit<Product, "id">;

  return {
    id: snapshot.id,
    ...data,
  } as Product;
};

//* Crear un nuevo producto:
type NewProduct = Omit<Product, "id">;
// const newProduct = {
//   name: "Teclado Mecánico",
//   price: 150,
//   category: "peripherals",
//   stock: 5
// };

export const addProduct = async (product: NewProduct): Promise<string> => {
  const docRef = await addDoc(collection(db, "products"), product);
  return docRef.id;
};

//* Obtener productos por categoría ordenados por precio:
//* Mapper reutilizable
const mapProduct = (doc: QueryDocumentSnapshot<DocumentData>): Product => {
  const data = doc.data() as unknown as Omit<Product, "id">;

  return {
    id: doc.id,
    ...data,
  } as Product;
};

export const getProductsByCategory = async (
  category: string,
): Promise<Product[]> => {
  try {
    // Validación básica:
    if (!category.trim()) {
      return [];
    }

    const productsRef = collection(db, "products");

    const productsQuery = query(
      productsRef,
      where("category", "==", category),
      orderBy("price", "asc"),
    );

    const snapshot = await getDocs(productsQuery);

    return snapshot.docs.map(mapProduct);
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

// export const getProductsByCategory = async (
//   category: string,
// ): Promise<Product[]> => {
//   const q = query(
//     collection(db, "products"),
//     where("category", "==", category),
//     orderBy("price", "asc"),
//   );

//   const snapshot = await getDocs(q);

//   return snapshot.docs.map(
//     (doc) =>
//       ({
//         id: doc.id,
//         ...doc.data(),
//       }) as Product,
//   );
// };
