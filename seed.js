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
		"Nike Air Max Techwear Edition",
		"Nike Pegasus Cyberpunk Glow",
		"Nike Revolution Neon Prime",
		"Nike Free Run Void",
		"Nike Zoom Hyperion",
		"Nimbus Cloud Platform Boots",
		"Ninja Runner Stealth Black",
		"Adidas Originals NMD Neon",
		"Adidas Ultraboost Dark Matter",
		"Adidas Stan Smith Cyber",
		"Puma Suede Futuristic",
		"Puma RS-X Neon Rave",
		"Reebok Classic Acid Lime",
		"Reebok Nano Tactical",
		"Vans Old Skool Electro",
		"Vans Sk8-Hi Holographic",
		"Converse Chuck Taylor Glitch",
		"New Balance 990 Stealth",
		"New Balance 327 Cyberpunk",
		"Asics Gel-Kayano Flux",
		"Brooks Ghost Phantom",
		"Saucony Endorphin Spectra",
		"Hoka Bondi Obsidian",
		"On Cloud Eclipse",
		"Salomon Speedcross Techwear",
		"Cyber-Boots Tactical Void",
		"Neon-Rider High-Tops",
		"Orbit Runner White Glow",
		"Spectre Sneaker Matrix",
		"Void Runner Triple Black",
		"Aero Sneaker Cyan Flare",
		"Synthwave Platform Highs",
		"Hyper-Viper Tech Sneakers",
		"Grid-Runner Magenta Flash",
		"Gravity Boots Zero-G",
		"Pulse Racer Acid Green",
		"Quantum Sneaker Hologram",
		"Cyber-Stalker Mid-Boots",
		"Hex-Shield Waterproof Shoes",
		"Talon Tactical Urban Boots",
		"Apex Runner Obsidian",
		"Phantom Trainer Triple White",
		"Aether Walker Luminous",
		"Vector Sneaker Vaporwave",
		"Prism High-Tops Rainbow",
		"Titan Combat Heavy Boots",
		"Stealth Slip-on V1",
		"Sonic Runner Electric Blue",
		"Eclipse Combat Mid-Boots",
		"Chronos Light-Up Highs"
	],
	clothing: [
		"Nike Tech Fleece Matrix",
		"Nike Dri-FIT Tee Cyber",
		"Nike Sportswear Hoodie Glitch",
		"Adidas Tiro Neon Trackpant",
		"Adidas Track Jacket Electro",
		"Adidas Originals Tee Holographic",
		"Levi's 501 Cyber-Distressed",
		"Levi's Trucker Jacket Patchwork",
		"Champion Hoodie Neon Purple",
		"Carhartt WIP Tee Heavy Acid",
		"Uniqlo Heattech Stealth layer",
		"Uniqlo Airism Cyber Oversized",
		"Patagonia Better Sweater Tech",
		"North Face Denali Cyber-Fleece",
		"Columbia Fleece Neon Piping",
		"Under Armour Tee Compression",
		"Lululemon ABC Pant Tactical",
		"Calvin Klein Tee Stealth Black",
		"Tommy Hilfiger Polo Electro",
		"Ralph Lauren Polo Cyber-Blue",
		"Cyberpunk Trench Coat Phantom",
		"Techwear Bomber Jacket V1",
		"Holographic Windbreaker Neon",
		"Matrix Leather Long Coat",
		"Vaporwave Pastel Sweatshirt",
		"Stealth Cargo Pants modular",
		"Neon-Glow Mesh Crop Top",
		"Tactical Vest Shield v2",
		"Cyber-Ninja Hoodie Masked",
		"Acid-Wash Graphic Tee Void",
		"Grid-Pattern Utility Joggers",
		"Spectral Light-Up Windbreaker",
		"Thermal Techwear Undershirt",
		"Void Oversized Tech Hoodie",
		"Neon Hacker Utility Jacket",
		"Viper Tactical Jogger Pants",
		"Cyber-Goth Strap Cargo Pants",
		"Aero-Light Running Windbreaker",
		"Digital Glitch Oversized Tee",
		"Chrono Tactical Utility Pants",
		"Carbon Fiber Accent Hoodie",
		"Exo-Skeleton Print Crewneck",
		"Neon Strike Graphic Tee",
		"Vapor Joggers Pastel Sunset",
		"Sub-Zero Thermal Parka Tech",
		"Reflective Night-Rider Vest",
		"Stealth Hooded Longsleeve",
		"Modular Pocket Utility Jacket",
		"Nexus Cyber-Weave Joggers",
		"Hyper-Bright Neon Tracksuit"
	],
	accessories: [
		"PlayStation 5 Pro Neon Special Edition",
		"Xbox Series X Cyber-Custom Console",
		"Nintendo Switch OLED Neon-Grid Bundle",
		"Steam Deck OLED Stealth Techwear Kit",
		"ASUS ROG Ally Extreme Cyber-Handheld",
		"Apple iPad Pro M4 Holographic Shell",
		"iPhone 15 Pro Max Carbon Shield",
		"Samsung Galaxy S24 Ultra Matrix Case",
		"AirPods Max Matte Midnight Glow",
		"Sony WH-1000XM5 Techwear Headset",
		"Ray-Ban Aviator Cyber-Lens",
		"Ray-Ban Wayfarer Hologram",
		"Oakley Holbrook Stealth Polarized",
		"Casio G-Shock Neon-Resistant",
		"Apple Watch Band Techwear Webbing",
		"Herschel Backpack Modular Stealth",
		"Fjallraven Kanken Cyber-Reflective",
		"JanSport Classic Electro-Print",
		"Nike Cap Cyberpunk Mesh",
		"Adidas Beanie Acid Lime",
		"New Era 9Fifty Cyberpunk Snapback",
		"Patagonia Hat Techwear Shield",
		"Carhartt Beanie Neon Magenta",
		"Stance Socks Cyberpunk Grid",
		"Nike Crew Socks Neon Accents",
		"Meta Quest 3 VR Neon Headset",
		"Logitech G PRO X Superlight Mouse",
		"Razer BlackWidow V4 Pro Cyberpunk Keyboard",
		"Elgato Stream Deck Cyber-Neon Custom",
		"DJI Neo Mini Drone Stealth Edition",
		"Anker 3-in-1 MagSafe Cyber Charging Station",
		"Keychron Q1 Max Mechanical Keyboard",
		"Shure SM7B Midnight Cyber Microphone",
		"GoPro HERO12 Black Tactical Mount Kit",
		"Sennheiser HD 800 S Audiophile Cyber Headset",
		"SteelSeries Arctis Nova Pro Wireless Headset",
		"WD Black SN850X 2TB SSD PS5 Heatsink",
		"Elgato Wave:3 Cyberpunk Microphone",
		"Belkin MagSafe Vent Mount Pro Cyber",
		"Nanoleaf Lines Cyber-Neon Starter Kit",
		"Philips Hue Play Gradient Light Tube",
		"Corsair MP600 PRO LPX 2TB SSD",
		"HyperX QuadCast S RGB Cyber Microphone",
		"Audio-Technica ATH-M50xBT2 Cyber Headphones",
		"Tile Pro Sleek Tracker Case V2",
		"Peak Design Tech Pouch Carbon V2",
		"Nomad Base One Max MagSafe Charger",
		"Peak Design Everyday Backpack 20L Cyber",
		"Dbrand Grip Case Apple iPhone 15 Pro",
		"Secrid Slimwallet Matrix Carbon Fiber"
	]
};

async function seed() {
  const products = Object.entries(CATALOG).flatMap(([categoryId, names]) => 
    names.map((name, index) => {
      const cleanName = name.trim();
      const docId = `${categoryId}_${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
      const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(cleanName)}/300/300`;
      
      // Mapear nombre estético de categoría compatible con el conversor del front-end
      let categoryName = categoryId;
      if (categoryId === 'shoes') categoryName = 'Zapatillas';
      if (categoryId === 'clothing') categoryName = 'Ropa';
      if (categoryId === 'accessories') categoryName = 'Accesorios';

      // Exactamente 25 productos de cada sección (índice 0 al 24) tendrán stock de 1 a 5 (Últimas Unidades)
      // Los otros 25 productos de cada sección tendrán stock de 10 a 50
      const stock = index < 25 ? Math.round(1 + Math.random() * 4) : Math.round(10 + Math.random() * 40);

      return {
        id: docId,
        name: cleanName,
        nameLower: cleanName.toLowerCase(),
        categoryId: categoryId,
        category: categoryName, // Para consistencia de mapeo
        price: Math.round(50 + Math.random() * 250),
        image: imageUrl,       // Retrocompatibilidad
        imageUrl: imageUrl,    // Cumple con la interfaz Product
        description: `Exclusivo artículo ${cleanName} diseñado bajo una estética cyberpunk y techwear. Fabricado con materiales de alto rendimiento para garantizar durabilidad, funcionalidad y un estilo de vanguardia en la calle.`,
        stock: stock,          // Asigna últimas unidades si stock <= 5
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
