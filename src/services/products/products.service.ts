import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { Product } from "../../types";

const productsCollection = collection(db, "products");

//* GET ALL:
export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(productsCollection);

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Product,
  );
};

//* GET BY ID:
export const getProductById = async (
  productId: string,
): Promise<Product | null> => {
  const documentRef = doc(db, "products", productId);

  const snapshot = await getDoc(documentRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Product;
};

//* CREATE:
export const createProduct = async (product: Omit<Product, "id">) => {
  return addDoc(productsCollection, {
    ...product,
    //* NO utilizamos "new Date()": La hora del Cliente puede ser de otra zona, ser manipulada o ser incorrecta.
    //* Utilizamos "serverTimestamp()": Firestone
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

//* UPDATE:
export const updateProduct = async (
  productId: string,
  product: Partial<Product>,
) => {
  const documentRef = doc(db, "products", productId);

  return updateDoc(documentRef, {
    ...product,
    updatedAt: serverTimestamp(),
  });
};

//* DELETE:
export const deleteProduct = async (productId: string) => {
  const documentRef = doc(db, "products", productId);
  return deleteDoc(documentRef);
};
