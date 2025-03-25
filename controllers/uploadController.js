// controllers/uploadController.js
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const prisma = require('../utils/prismaClient');
const { v4: uuidv4 } = require('uuid');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// POST /api/uploads/signed-url
const generateSignedUrl = async (req, res) => {
  const { project_id, fileType, extension } = req.body;

  if (!project_id || !fileType || !extension) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const key = `uploads/${req.user.id}/${project_id}/${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: `application/${extension}`,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min

    // Log the file metadata in DB
    await prisma.files.create({
      data: {
        url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
        fileType,
        project_id: parseInt(project_id),
        user_id: req.user.id,
      },
    });

    res.json({ signedUrl });
  } catch (error) {
    console.error('❌ Error generating signed URL:', error);
    res.status(500).json({ message: 'Error generating signed URL', error: error.message });
  }
};

module.exports = {
  generateSignedUrl,
};
