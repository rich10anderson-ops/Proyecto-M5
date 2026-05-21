import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "node:crypto";

//* Credenciales de AWS y Bucket (Conecta con AWS):
const s3 = new S3Client({
	region: process.env.AWS_REGION!,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});
const BUCKET = process.env.S3_BUCKET!;

//* Formatos Permitidos:
const ALLOWED_TYPES = [ "image/jpeg", "image/png", "image/webp" ];

export default async function handler(
	req: VercelRequest,
	res: VercelResponse
) {
	//* Solo permitimos POST:
	if (req.method !== "POST") {
		return res.status(405).json({
			error: "Method not allowed",
		});
	}
	
	const { filename, contentType } = req.body as {
		filename: string;
		contentType: string;
	};
	
	//* Validaciones:
	if (!filename || !contentType) {
		return res.status(400).json({
			error: "filename and contentType are required",
		});
	}
	
	if (!ALLOWED_TYPES.includes(contentType)) {
		return res.status(400).json({
			error: "File type not allowed",
		});
	}
	
	//* Generamos path único:
	const key = `products/${randomUUID()}-${filename}`;
	
	try {
		const url = await getSignedUrl(
			s3,
			new PutObjectCommand({
				Bucket: BUCKET,
				Key: key,
				ContentType:
					contentType,
			}),
			{
				//* Valor en Segundos (600 seg = 10 minutos):
				expiresIn: 600,
			}
		);
		
		const publicUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
		
		return res.status(200).json({
			url,
			key,
			publicUrl,
		});
	} catch (error) {
		console.error("[presign] failed", error);
		
		return res.status(500).json({
			error: "No se pudo generar la URL firmada",
		});
	}
}
