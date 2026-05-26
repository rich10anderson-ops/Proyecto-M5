export const uploadImage = async (file: File): Promise<string> => {
	//* 1. Pedimos URL firmada:
	const presignResponse = await fetch("/api/get-presigned-url", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			filename: file.name,
			filetype: file.type,
		}),
	});
	
	if (!presignResponse.ok) {
		throw new Error("No se pudo obtener la URL firmada");
	}
	
	const { uploadUrl, fileUrl } = await presignResponse.json();
	
	//* 2. Upload directo a S3:
	const uploadResponse = await fetch(uploadUrl, {
		method: "PUT",
		headers: {
			"Content-Type": file.type,
		},
		body: file,
	});
	  
	if (!uploadResponse.ok) {
		throw new Error("No se pudo subir la imagen a S3");
	}
	  
	//* 3. Retornamos URL pública:
	return fileUrl;
};
