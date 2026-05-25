import "dotenv/config";
import { initializeApp } from "firebase/app";
import {
  collection, doc,
  getFirestore,
  setDoc
} from "firebase/firestore";

// Helper to sanitize environment variables (removes accidental quotes, commas, and spaces)
const sanitizeEnvVar = (value) => {
  if (!value) return '';
  return value
    .trim()
    .replace(/^["']|["']$/g, '') // remove surrounding double or single quotes
    .replace(/,$/, '')           // remove trailing comma
    .trim()
    .replace(/^["']|["']$/g, ''); // run again in case of spaces inside quotes
};

const firebaseConfig = {
	apiKey: sanitizeEnvVar(process.env.VITE_FIREBASE_API_KEY),
	authDomain: sanitizeEnvVar(process.env.VITE_FIREBASE_AUTH_DOMAIN),
	projectId: sanitizeEnvVar(process.env.VITE_FIREBASE_PROJECT_ID),
	storageBucket: sanitizeEnvVar(process.env.VITE_FIREBASE_STORAGE_BUCKET),
	messagingSenderId: sanitizeEnvVar(process.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
	appId: sanitizeEnvVar(process.env.VITE_FIREBASE_APP_ID),
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CATALOG = {
	shoes: [
		"Nike Air Max", "Nike Pegasus", "Nike Revolution", "Nike Free Run", "Nike Zoom", "Nimbus Cloud", "Ninja Runner", "Adidas Originals", "Adidas Ultraboost", "Adidas Stan Smith", "Puma Suede", "Puma RS-X", "Reebok Classic", "Reebok Nano", "Vans Old Skool", "Vans Sk8-Hi", "Converse Chuck Taylor", "New Balance 990", "New Balance 327", "Asics Gel-Kayano", "Brooks Ghost", "Saucony Endorphin", "Hoka Bondi", "On Cloud", "Salomon Speedcross",
	],
	clothing: [
		"Nike Tech Fleece", "Nike Dri-FIT Tee", "Nike Sportswear Hoodie", "Adidas Tiro", "Adidas Track Jacket", "Adidas Originals Tee", "Levi's 501", "Levi's Trucker Jacket", "Champion Hoodie", "Carhartt WIP Tee", "Uniqlo Heattech", "Uniqlo Airism", "Patagonia Better Sweater", "North Face Denali", "Columbia Fleece", "Under Armour Tee", "Lululemon ABC Pant", "Calvin Klein Tee", "Tommy Hilfiger Polo", "Ralph Lauren Polo",  
	],
	accessories: [
		"Ray-Ban Aviator", "Ray-Ban Wayfarer", "Oakley Holbrook", "Casio G-Shock", "Apple Watch Band", "Herschel Backpack", "Fjallraven Kanken", "JanSport Classic", "Nike Cap", "Adidas Beanie", "New Era 9Fifty", "Patagonia Hat", "Carhartt Beanie", "Stance Socks", "Nike Crew Socks",  
	],
};

async function seed() {
  const products = Object.entries(CATALOG).flatMap(([categoryId, names]) => 
    names.map(name => {
      const cleanName = name.trim();
      const docId = `${categoryId}_${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
      const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(cleanName)}/300/300`;
      
      // Mapear nombre estético de categoría compatible con el conversor del front-end
      let categoryName = categoryId;
      if (categoryId === 'shoes') categoryName = 'Zapatillas';
      if (categoryId === 'clothing') categoryName = 'Ropa';
      if (categoryId === 'accessories') categoryName = 'Accesorios';
      return {
        id: docId,
        name: cleanName,
        nameLower: cleanName.toLowerCase(),
        categoryId: categoryId,
        category: categoryName, // Para consistencia de mapeo
        price: Math.round(50 + Math.random() * 250),
        image: imageUrl,       // Retrocompatibilidad
        imageUrl: imageUrl,    // Cumple con la interfaz Product
        description: `Increíble producto de la línea ${cleanName}. Diseñado con materiales de alta calidad, ideal para un estilo urbano y futurista.`,
        stock: Math.round(5 + Math.random() * 45), // Stock aleatorio entre 5 y 50
        averageRating: parseFloat((4 + Math.random()).toFixed(1)), // Calificaciones realistas (4.0 a 5.0)
        totalReviews: Math.round(Math.random() * 15), // Cantidad de comentarios aleatorios
        createdAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(), // Fechas aleatorias de los últimos 30 días para ordenar
      };
    })
  );
  
  console.log(`Sembrando ${products.length} productos completos en Firestore...`);
  for (const p of products) {
    const ref = doc(db, "products", p.id);
    const { id, ...dataToSave } = p;
    await setDoc(ref, dataToSave);
    console.log(`  + ${p.name} [Stock: ${p.stock}]`);
  }
  console.log(`Listo: ${products.length} productos.`);
  process.exit(0);
}

seed().catch(err => {
	console.error("\n❌ ERROR DE CONEXIÓN O PERMISOS EN FIRESTORE:");
	console.error(err.message || err);
	console.error("\n👉 SOLUCIÓN DEFINITIVA PARA PRODUCCIÓN:");
	console.error("1. Ve a Firebase Console -> Firestore Database -> pestaña 'Rules'.");
	console.error("2. Permite temporalmente lecturas y escrituras públicas para la siembra cambiando las reglas a:");
	console.error("   allow read, write: if true;");
	console.error("3. Vuelve a ejecutar 'node seed.js' en tu terminal.");
	console.error("4. Una vez completado con éxito, restablece reglas seguras para producción, por ejemplo:");
	console.error("   allow read: if true;");
	console.error("   allow write: if request.auth != null;");
	process.exit(1);
});
