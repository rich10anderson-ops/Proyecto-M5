import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  orderBy,
  startAfter,
  Timestamp,
  writeBatch,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  type DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Order, Review, CartItem, OrderStatus, OrderProductSnapshot } from '../types';

export const productConverter: FirestoreDataConverter<Product> = {
  toFirestore(product: Product): DocumentData {
    let dbCategory = product.category;
    let dbCategoryId = product.category;

    if (product.category === 'Zapatillas') {
      dbCategory = 'shoes';
      dbCategoryId = 'shoes';
    } else if (product.category === 'Ropa') {
      dbCategory = 'clothing';
      dbCategoryId = 'clothing';
    } else if (product.category === 'Accesorios') {
      dbCategory = 'accessories';
      dbCategoryId = 'accessories';
    }

    return {
      name: product.name,
      nameLower: product.name.toLowerCase(),
      description: product.description || '',
      price: product.price,
      categoryId: dbCategoryId,
      category: dbCategory,
      image: product.imageUrl,
      imageUrl: product.imageUrl,
      stock: product.stock,
      createdAt: product.createdAt,
      averageRating: product.averageRating !== undefined ? product.averageRating : null,
      totalReviews: product.totalReviews !== undefined ? product.totalReviews : null
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Product {
    const data = snapshot.data(options);
    let category = data.category ?? data.categoryId ?? '';
    
    // Map database seed IDs to user-friendly Spanish names
    if (category === 'shoes') {
      category = 'Zapatillas';
    } else if (category === 'clothing') {
      category = 'Ropa';
    } else if (category === 'accessories') {
      category = 'Accesorios';
    }

    return {
      id: snapshot.id,
      name: data.name ?? '',
      description: data.description ?? '',
      price: Number(data.price ?? 0),
      category: category,
      imageUrl: data.imageUrl ?? data.image ?? '',
      stock: data.stock !== undefined ? Number(data.stock) : 10,
      averageRating: data.averageRating !== null && data.averageRating !== undefined ? Number(data.averageRating) : undefined,
      totalReviews: data.totalReviews !== null && data.totalReviews !== undefined ? Number(data.totalReviews) : undefined,
      createdAt: data.createdAt ?? new Date().toISOString()
    };
  }
};


// ==========================================================================
// MOCK DATA PARA FALLBACK LOCAL (CYBERPUNK & TECHWEAR PRODUCTS)
// ==========================================================================
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'CYBER-HOODIE // SHIELD v1',
    description: 'Buzo táctico streetwear con detalles reflejantes de neón magenta y tela impermeable resistente al viento. Cuenta con capucha ajustable y bolsillos modulares.',
    price: 79.99,
    category: 'Vestimenta',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
    stock: 25,
    averageRating: 4.8,
    totalReviews: 5,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'prod-2',
    name: 'TECLADO MECÁNICO // SPECTRE-87',
    description: 'Teclado mecánico premium TKL con switches gateron hot-swap. Retroiluminación RGB neon intensa cian y magenta. Keycaps de PBT sublimadas con tipografía futurista.',
    price: 129.99,
    category: 'Accesorios',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop',
    stock: 15,
    averageRating: 4.9,
    totalReviews: 4,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'prod-3',
    name: 'AUDIO PODS // ECLIPSE ANC',
    description: 'Auriculares inalámbricos TWS con cancelación activa de ruido híbrida de 40dB y estuche translúcido con iluminación neón verde lima. Autonomía de hasta 32 horas.',
    price: 89.99,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
    stock: 30,
    averageRating: 4.5,
    totalReviews: 3,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'prod-4',
    name: 'CYBER GLASSES // HYPER-VISION',
    description: 'Gafas de sol futuristas envolventes con montura de policarbonato ligera. Lentes de espejo polarizadas con protección UV400 y revestimiento antirrayas.',
    price: 49.99,
    category: 'Accesorios',
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop',
    stock: 40,
    averageRating: 4.6,
    totalReviews: 2,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-5',
    name: 'LETRERO DE NEÓN MATRIX LED',
    description: 'Letrero de neón LED flexible RGB programable. Matriz de luces ultra-brillantes controlable vía app móvil. Ideal para setups gaming o decoración urbana.',
    price: 199.99,
    category: 'Dispositivos Inteligentes',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=600&auto=format&fit=crop',
    stock: 8,
    averageRating: 5.0,
    totalReviews: 6,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: 'prod-6',
    name: 'SMARTPHONE // MATRIX-X PRO',
    description: 'Smartphone futurista con pantalla AMOLED curva de 120Hz. Trasera de cristal holográfico reactivo. Triple cámara de 108MP y carga ultra-rápida de 120W.',
    price: 899.99,
    category: 'Smartphones',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop',
    stock: 10,
    averageRating: 4.7,
    totalReviews: 3,
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
  },
  {
    id: 'prod-7',
    name: 'MOUSE GAMING // PULSE-RGB',
    description: 'Mouse gaming inalámbrico ultraligero de 55 gramos. Sensor óptico de 26,000 DPI de máxima precisión. Tira de neón cian inferior personalizable.',
    price: 69.99,
    category: 'Accesorios',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop',
    stock: 22,
    averageRating: 4.4,
    totalReviews: 2,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'prod-8',
    name: 'TECHWEAR SLING BAG // KINETIC',
    description: 'Bandolera táctica de nylon balístico resistente al agua. Hebillas de liberación rápida de aleación, compartimento para tableta y correas reflectantes.',
    price: 59.99,
    category: 'Vestimenta',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
    stock: 18,
    averageRating: 4.6,
    totalReviews: 2,
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString()
  },
  {
    id: 'prod-9',
    name: 'LAPTOP GAMING // NEBULAX 15',
    description: 'Portátil gaming de alto rendimiento con Intel Core i7, 32GB RAM y gráfica RTX 4070. Teclado retroiluminado RGB neón y chasis de aluminio pulido cian.',
    price: 1499.99,
    category: 'Laptops',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop',
    stock: 5,
    averageRating: 4.8,
    totalReviews: 4,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'prod-10',
    name: 'CYBERBOOM PORTABLE SPEAKER',
    description: 'Bocina inalámbrica bluetooth 5.3 con potencia de 40W. Subwoofers con iluminación neón reactiva al ritmo del beat. Totalmente sumergible (IPX7).',
    price: 119.99,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600&auto=format&fit=crop',
    stock: 14,
    averageRating: 4.7,
    totalReviews: 3,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 'prod-11',
    name: 'CONTROLADOR LED NEÓN RGB',
    description: 'Controlador Wi-Fi inteligente para tiras de luces LED y neón. Sincronización de música inteligente, compatible con Alexa, Google Assistant y Siri shortcuts.',
    price: 29.99,
    category: 'Dispositivos Inteligentes',
    imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=600&auto=format&fit=crop',
    stock: 50,
    averageRating: 4.3,
    totalReviews: 1,
    createdAt: new Date(Date.now() - 86400000 * 11).toISOString()
  },
  {
    id: 'prod-12',
    name: 'CYBER WRIST BAND // BIO-X',
    description: 'Pulsera deportiva futurista con pantalla curva flexible AMOLED. Monitorización continua de pulso cardíaco, oxígeno en sangre, estrés y 120 modos deportivos.',
    price: 149.99,
    category: 'Dispositivos Inteligentes',
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=600&auto=format&fit=crop',
    stock: 16,
    averageRating: 4.5,
    totalReviews: 3,
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
  }
];

// Base de datos simulada en LocalStorage
const getLocalProducts = (): Product[] => {
  const local = localStorage.getItem('cyber_products');
  if (!local) {
    localStorage.setItem('cyber_products', JSON.stringify(MOCK_PRODUCTS));
    return MOCK_PRODUCTS;
  }
  return JSON.parse(local);
};

const saveLocalProducts = (products: Product[]) => {
  localStorage.setItem('cyber_products', JSON.stringify(products));
};

const getLocalReviews = (productId: string): Review[] => {
  const allReviewsStr = localStorage.getItem(`cyber_reviews_${productId}`);
  if (!allReviewsStr) {
    const defaults: Review[] = [
      {
        id: `rev-${productId}-1`,
        userId: 'user-default-1',
        userName: 'AstroRider',
        rating: 5,
        comment: '¡Increíble producto! El diseño es de otro planeta y la calidad supera lo esperado. Se ve hermoso con luces neón.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: `rev-${productId}-2`,
        userId: 'user-default-2',
        userName: 'VaporWaveBoy',
        rating: 4,
        comment: 'Muy buen desempeño visual y funcional. El empaque y la estética street son excelentes.',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ];
    localStorage.setItem(`cyber_reviews_${productId}`, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(allReviewsStr);
};

const saveLocalReviews = (productId: string, reviews: Review[]) => {
  localStorage.setItem(`cyber_reviews_${productId}`, JSON.stringify(reviews));
};

const getLocalOrders = (): Order[] => {
  const o = localStorage.getItem('cyber_orders');
  return o ? JSON.parse(o) : [];
};

const saveLocalOrders = (orders: Order[]) => {
  localStorage.setItem('cyber_orders', JSON.stringify(orders));
};

// ==========================================================================
// FUNCIONES DEL CATÁLOGO DE PRODUCTOS (CON FALLBACK LOCAL AUTOMÁTICO)
// ==========================================================================

export const getProducts = async (
  category?: string,
  search?: string,
  limitCount: number = 12,
  lastVisible?: any
): Promise<{ products: Product[]; lastDoc: any; totalCount: number }> => {
  try {
    // Intentar consulta real de Firestore
    const productsRef = collection(db, 'products').withConverter(productConverter);
    let qConstraints: any[] = [];

    if (category && category !== 'Todos') {
      let dbCategory = category;
      if (category === 'Zapatillas') dbCategory = 'shoes';
      if (category === 'Ropa') dbCategory = 'clothing';
      if (category === 'Accesorios') dbCategory = 'accessories';

      const isSeedCategory = dbCategory === 'shoes' || dbCategory === 'clothing' || dbCategory === 'accessories';
      const categoryField = isSeedCategory ? 'categoryId' : 'category';
      qConstraints.push(where(categoryField, '==', dbCategory));
    }

    if (search && search.trim()) {
      const searchPrefix = search.toLowerCase().trim();
      qConstraints.push(where('nameLower', '>=', searchPrefix));
      qConstraints.push(where('nameLower', '<=', searchPrefix + '\uf8ff'));
      qConstraints.push(orderBy('nameLower', 'asc'));
    } else {
      qConstraints.push(orderBy('createdAt', 'desc'));
    }
    
    if (lastVisible) {
      qConstraints.push(startAfter(lastVisible));
    }
    
    qConstraints.push(limit(limitCount));

    let querySnapshot;
    try {
      const q = query(productsRef, ...qConstraints);
      querySnapshot = await getDocs(q);
    } catch (indexError) {
      console.warn('getProducts - Firestore index missing or query failed, trying client fallback query:', indexError);
      
      const fallbackConstraints: any[] = [orderBy('createdAt', 'desc')];
      if (category && category !== 'Todos') {
        let dbCategory = category;
        if (category === 'Zapatillas') dbCategory = 'shoes';
        if (category === 'Ropa') dbCategory = 'clothing';
        if (category === 'Accesorios') dbCategory = 'accessories';

        const isSeedCategory = dbCategory === 'shoes' || dbCategory === 'clothing' || dbCategory === 'accessories';
        const categoryField = isSeedCategory ? 'categoryId' : 'category';
        fallbackConstraints.push(where(categoryField, '==', dbCategory));
      }
      if (lastVisible) {
        fallbackConstraints.push(startAfter(lastVisible));
      }
      fallbackConstraints.push(limit(limitCount * 2));
      
      const qFallback = query(productsRef, ...fallbackConstraints);
      querySnapshot = await getDocs(qFallback);
    }
    
    let productsList: Product[] = querySnapshot.docs.map(docSnap => docSnap.data());

    // Filtro cliente para la búsqueda por texto si está presente y falló o requiere más precisión
    if (search) {
      const normalizedSearch = search.toLowerCase().trim();
      productsList = productsList.filter(p => 
        p.name.toLowerCase().includes(normalizedSearch) || 
        p.description.toLowerCase().includes(normalizedSearch)
      );
    }

    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    // Obtener total para la paginación
    const totalSnapshot = await getDocs(collection(db, 'products'));
    let totalCount = totalSnapshot.size;
    if (totalCount === 0) {
      // Si la colección de Firestore está vacía, forzar fallback a local
      throw new Error('Firestore collection is empty, fall back to mock data');
    }

    return { products: productsList, lastDoc, totalCount };
  } catch (error) {
    console.warn('getProducts - Cayendo en base de datos local pre-cargada:', error);
    
    // Fallback a Base de Datos Local
    let productsList = getLocalProducts();

    if (category && category !== 'Todos') {
      productsList = productsList.filter(p => p.category === category);
    }

    if (search) {
      const normalizedSearch = search.toLowerCase().trim();
      productsList = productsList.filter(p => 
        p.name.toLowerCase().includes(normalizedSearch) || 
        p.description.toLowerCase().includes(normalizedSearch)
      );
    }

    // Simular paginación local
    const totalCount = productsList.length;
    const startIndex = lastVisible ? productsList.findIndex(p => p.id === lastVisible) + 1 : 0;
    const paginatedProducts = productsList.slice(startIndex, startIndex + limitCount);
    const lastDoc = paginatedProducts.length > 0 ? paginatedProducts[paginatedProducts.length - 1].id : null;

    return { products: paginatedProducts, lastDoc, totalCount };
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, 'products', id).withConverter(productConverter);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.warn(`getProductById (${id}) - Usando fallback local:`, error);
    const products = getLocalProducts();
    return products.find(p => p.id === id) || null;
  }
};

export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'averageRating' | 'totalReviews'>): Promise<string> => {
  const timestamp = new Date().toISOString();
  const finalProduct = {
    ...productData,
    averageRating: 5.0,
    totalReviews: 0,
    createdAt: timestamp
  };

  try {
    const docRef = await addDoc(collection(db, 'products'), finalProduct);
    return docRef.id;
  } catch (error) {
    console.warn('createProduct - Guardando localmente en localStorage:', error);
    const products = getLocalProducts();
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = { id: newId, ...finalProduct };
    products.push(newProduct);
    saveLocalProducts(products);
    return newId;
  }
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<void> => {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, productData);
  } catch (error) {
    console.warn(`updateProduct (${id}) - Guardando localmente:`, error);
    const products = getLocalProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...productData };
      saveLocalProducts(products);
    }
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn(`deleteProduct (${id}) - Eliminando localmente:`, error);
    const products = getLocalProducts();
    const updated = products.filter(p => p.id !== id);
    saveLocalProducts(updated);
  }
};

// ==========================================================================
// COMENTARIOS Y RESEÑAS DE PRODUCTOS (REVIEWS)
// ==========================================================================

type ReviewsPageCursor = QueryDocumentSnapshot<DocumentData> | string | null;

export interface ReviewsPage {
  reviews: Review[];
  lastDoc: ReviewsPageCursor;
  hasMore: boolean;
}

const buildOrderProductSnapshots = (items: CartItem[]): OrderProductSnapshot[] => {
  return items.map(({ product, quantity }) => ({
    productId: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    imageUrl: product.imageUrl,
    quantity,
  }));
};

export const getReviewsPage = async (
  productId: string,
  limitCount: number = 5,
  lastVisible?: ReviewsPageCursor
): Promise<ReviewsPage> => {
  try {
    const reviewsRef = collection(db, `products/${productId}/reviews`);
    const constraints: any[] = [orderBy('createdAt', 'desc')];
    if (lastVisible && typeof lastVisible !== 'string') {
      constraints.push(startAfter(lastVisible));
    }
    constraints.push(limit(limitCount + 1));

    const q = query(reviewsRef, ...constraints);
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.slice(0, limitCount);

    return {
      reviews: docs.map((d) => ({ id: d.id, ...d.data() } as Review)),
      lastDoc: docs[docs.length - 1] || null,
      hasMore: snapshot.docs.length > limitCount,
    };
  } catch (error) {
    console.warn(`getReviewsPage (${productId}) - Usando reviews locales:`, error);
    const allReviews = getLocalReviews(productId);
    const startIndex = typeof lastVisible === 'string'
      ? allReviews.findIndex(r => r.id === lastVisible) + 1
      : 0;
    const page = allReviews.slice(startIndex, startIndex + limitCount);

    return {
      reviews: page,
      lastDoc: page.length > 0 ? page[page.length - 1].id : null,
      hasMore: startIndex + limitCount < allReviews.length,
    };
  }
};

export const getReviews = async (productId: string): Promise<Review[]> => {
  const page = await getReviewsPage(productId, 5);
  return page.reviews;
};

export const addReview = async (
  productId: string,
  reviewData: Omit<Review, 'id' | 'createdAt'>
): Promise<void> => {
  const timestamp = new Date().toISOString();
  const finalReview = {
    ...reviewData,
    createdAt: timestamp
  };

  try {
    // Agregar review a la subcolección
    await addDoc(collection(db, `products/${productId}/reviews`), finalReview);
    
    // Actualizar promedio en el producto
    const reviewsRef = collection(db, `products/${productId}/reviews`);
    const snapshot = await getDocs(reviewsRef);
    let totalRatings = 0;
    snapshot.forEach(r => {
      totalRatings += r.data().rating;
    });
    const avg = parseFloat((totalRatings / snapshot.size).toFixed(1));

    const prodRef = doc(db, 'products', productId);
    await updateDoc(prodRef, {
      averageRating: avg,
      totalReviews: snapshot.size
    });
  } catch (error) {
    console.warn(`addReview (${productId}) - Agregando localmente:`, error);
    const reviews = getLocalReviews(productId);
    const newId = `rev-${Date.now()}`;
    const newReview: Review = { id: newId, ...finalReview };
    reviews.unshift(newReview);
    saveLocalReviews(productId, reviews);

    // Calcular promedio local
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = parseFloat((total / reviews.length).toFixed(1));

    // Actualizar producto local
    const products = getLocalProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      products[index].averageRating = avg;
      products[index].totalReviews = reviews.length;
      saveLocalProducts(products);
    }
  }
};

// ==========================================================================
// ORDENES Y CHECKOUT
// ==========================================================================

export const createOrder = async (orderData: Omit<Order, 'id'>): Promise<string> => {
  const orderPayload: Omit<Order, 'id'> = {
    ...orderData,
    productSnapshots: orderData.productSnapshots ?? buildOrderProductSnapshots(orderData.items),
  };

  try {
    const docRef = await addDoc(collection(db, 'orders'), orderPayload);
    return docRef.id;
  } catch (error) {
    console.warn('createOrder - Creando orden en almacenamiento local:', error);
    const orders = getLocalOrders();
    const newId = `order-${Date.now()}`;
    const newOrder: Order = { id: newId, ...orderPayload };
    orders.unshift(newOrder);
    saveLocalOrders(orders);
    return newId;
  }
};

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const ordersList: Order[] = [];
    snapshot.forEach((d) => {
      ordersList.push({ id: d.id, ...d.data() } as Order);
    });
    return ordersList;
  } catch (error) {
    console.warn(`getOrdersByUserId (${userId}) - Obteniendo órdenes locales:`, error);
    const orders = getLocalOrders();
    return orders.filter(o => o.userId === userId);
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const ordersList: Order[] = [];
    snapshot.forEach((d) => {
      ordersList.push({ id: d.id, ...d.data() } as Order);
    });
    return ordersList;
  } catch (error) {
    console.warn('getAllOrders - Obteniendo todas las órdenes locales:', error);
    return getLocalOrders();
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.warn(`updateOrderStatus (${orderId}) - Actualizando localmente:`, error);
    const orders = getLocalOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      saveLocalOrders(orders);
    }
  }
};

// ==========================================================================
// PERSISTENCIA DEL CARRITO POR USUARIO EN LA NUBE
// ==========================================================================

export const getUserCart = async (userId: string): Promise<CartItem[]> => {
  try {
    const docRef = doc(db, 'carts', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().items as CartItem[];
    }
    return [];
  } catch (error) {
    console.warn(`getUserCart (${userId}) - Retornando carrito de localStorage:`, error);
    const cartStr = localStorage.getItem(`cyber_cart_${userId}`);
    return cartStr ? JSON.parse(cartStr) : [];
  }
};

export const saveUserCart = async (userId: string, items: CartItem[]): Promise<void> => {
  try {
    const docRef = doc(db, 'carts', userId);
    await setDoc(docRef, { items, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.warn(`saveUserCart (${userId}) - Guardando en localStorage:`, error);
  } finally {
    // Sincronizar siempre localmente en localStorage como método secundario de respaldo seguro
    localStorage.setItem(`cyber_cart_${userId}`, JSON.stringify(items));
  }
};
