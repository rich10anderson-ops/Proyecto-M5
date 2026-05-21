/**
* Cliente de utilidad para subir archivos a S3
* Permite solicitar una URL pre-firmada a la función sin servidor de Vercel
* y subir el archivo binario directamente a S3 desde el navegador.

*/
//Función auxiliar para convertir archivos a Base64 (alternativa local)
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const uploadProductImage = async (file: File): Promise<string> => {
  try {
    // Solicitar una URL pre-firmada a nuestra función sin servidor de Vercel
    const response = await fetch('/api/get-presigned-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        filetype: file.type,
      }),
    });

    // Si la función sin servidor falló (por ejemplo, estado 501 o faltan las claves de AWS)
    if (!response.ok) {
      throw new Error(`Serverless endpoint returned status: ${response.status}`);
    }

    const { uploadUrl, fileUrl, isMock } = await response.json();

    if (isMock) {
      console.warn('API returned mock S3 upload URL. Falling back to local Base64 rendering.');
      return await convertToBase64(file);
    }

    // Envío directo de binarios a S3 mediante la URL firmada.
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`S3 direct upload failed with status: ${uploadResponse.status}`);
    }

    // Devuelve la URL de S3 de acceso público
    return fileUrl;
  } catch (error) {
    console.warn('La carga directa a S3 falló o faltan las claves de AWS. Se está ejecutando una copia de seguridad local premium Base64.:', error);
    
    // Opción alternativa: convertir a URI de datos base64
    // para que funcione perfectamente en la base de datos LocalStorage.
    const base64Data = await convertToBase64(file);
    return base64Data;
  }
};
