import {
  collection,
  endAt,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  where,
  type DocumentSnapshot,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product } from "../../types";

export type ListProductsParams = {
	categoryId?: string | null;
	searchPrefix?: string; // lowercase
	pageSize?: number;
	cursor?: DocumentSnapshot | null;
};

//* [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ] => ORDENAR Documentos!!!
//*   1  1  1  1  2  2  2  2  3  3   3
//*            ^

export type ListProductsResult = {
	items: Product[];
	lastDoc: DocumentSnapshot | null;
};

export async function listProducts(
	params: ListProductsParams = {}
): Promise<ListProductsResult> {
	const { categoryId, searchPrefix, pageSize = 20, cursor } = params;
	
	
	const constraints: QueryConstraint[] = [];
	
	
	if (categoryId) {
		constraints.push(where("categoryId", "==", categoryId));
	}
	
	
	constraints.push(orderBy("nameLower"));
	
	
	if (searchPrefix && searchPrefix.length >= 2) {
		constraints.push(startAt(searchPrefix));
		constraints.push(endAt(searchPrefix + "\uf8ff"));
	}
	
	
	if (cursor) {
		constraints.push(startAfter(cursor));
	}
	constraints.push(limit(pageSize));
	
	
	const q = query(collection(db, "products"), ...constraints);

	const snap = await getDocs(q);
	
	
	const items = snap.docs.map((d) => ({
		id: d.id,
		...(d.data() as Omit<Product, "id">),
	}));
	
	const lastDoc =
		snap.docs.length > 0
			? snap.docs[snap.docs.length - 1]
			: null;
	
	
	return { items, lastDoc };
}