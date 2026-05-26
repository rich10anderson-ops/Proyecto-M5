import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default async function handler(req: any, res: any) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { filename, filetype } = req.body;

  if (!filename || !filetype) {
    return res.status(400).json({ error: 'filename and filetype parameters are required.' });
  }

  const awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
  const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY;
  const bucketName = process.env.AWS_S3_BUCKET_NAME || process.env.AWS_S3_BUCKET || 'cyber-streetwear-bucket';
  const region = process.env.AWS_REGION || 'us-east-1';

  // Check if AWS keys are set up. If not, trigger the client-side mock/Base64 fallback gracefully.
  if (!awsAccessKey || !awsSecretKey) {
    console.warn('AWS credentials missing on server side. Instructing client to trigger local Base64 fallback.');
    return res.status(200).json({
      isMock: true,
      uploadUrl: '',
      fileUrl: '',
    });
  }

  try {
    const s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
      },
    });

    const fileKey = `products/${Date.now()}-${filename.replace(/\s+/g, '-')}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      ContentType: filetype,
    });

    // Generate signed URL valid for 5 minutes (300 seconds)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;

    return res.status(200).json({
      isMock: false,
      uploadUrl,
      fileUrl,
    });
  } catch (error: any) {
    console.error('Error generating S3 presigned URL:', error);
    return res.status(500).json({
      error: 'Failed to generate presigned upload URL.',
      details: error.message,
    });
  }
}
