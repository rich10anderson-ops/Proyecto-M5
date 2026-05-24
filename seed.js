import "dotenv/config";
import { initializeApp } from "firebase/app";
import {
  collection, doc,
  getFirestore,
  setDoc
} from "firebase/firestore";

const firebaseConfig = {
	apiKey: process.env.VITE_FIREBASE_API_KEY,
	authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.VITE_FIREBASE_APP_ID,
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
	const products = Object
		.entries(CATALOG).
		flatMap(([categoryId, names]) => names.map(name => ({
			name,
			nameLower: name.toLowerCase(),
			categoryId,
			price: Math.round(50 + Math.random() * 250),
			image: `https://picsum.photos/seed/${encodeURIComponent(name)}/300/300`,
		}))
	);
	
	console.log(
		`Sembrando ${products.length} productos en Firestore...`
	);
	for (const p of products) {
		const ref = doc(collection(db, "products"));
		await setDoc(ref, p);
		console.log(`  + ${p.name}`);
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
