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
import type { Product } from "../types";

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
	
	//* Array de Queries:
	const constraints: QueryConstraint[] = [];
	
	//* Filtros dinámicos:
	if (categoryId) {
		constraints.push(where("categoryId", "==", categoryId));
	}
	
	//* Orden, obligatorio en Firebase cuando paginamos:
	constraints.push(orderBy("nameLower"));
	
	//* Busqueda por prefijo:
	if (searchPrefix && searchPrefix.length >= 2) {
		constraints.push(startAt(searchPrefix));
		constraints.push(endAt(searchPrefix + "\uf8ff"));
	}
	
	//* Paginacion, utilizando cursores a documentos reales:
	if (cursor) {
		constraints.push(startAfter(cursor));
	}
	constraints.push(limit(pageSize));
	
	//* Query:
	const q = query(collection(db, "products"), ...constraints);
  //* constraints = [ where("categoryId": "zapatillas"), orderBy("nameLower"), cursor: 4, pageSize:4 ]
	
	//* Consulta a Firestone:
	const snap = await getDocs(q);
	
	//* Mapeo de ID:
	const items = snap.docs.map((d) => ({
		id: d.id,
		...(d.data() as Omit<Product, "id">),
	}));
	
	//* Ultimo Documento del resultado, marca proximo envio:
	const lastDoc =
		snap.docs.length > 0
			? snap.docs[snap.docs.length - 1]
			: null;
	
	//* Retorno de respuesta:
	return { items, lastDoc };
}