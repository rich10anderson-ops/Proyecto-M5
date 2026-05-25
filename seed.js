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
