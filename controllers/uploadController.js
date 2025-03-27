const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const prisma = require('../utils/prismaClient');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ✅ POST /api/uploads/signed-url
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

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    await prisma.files.create({
      data: {
        url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
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

// ✅ POST /api/uploads/project/:projectId/folder
const uploadMultipleFiles = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  try {
    const uploadedFiles = [];

    for (const file of req.files) {
      const key = `uploads/${userId}/${projectId}/${file.originalname}`;

      await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: fs.readFileSync(file.path),
        ContentType: file.mimetype,
      }));

      const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      const savedFile = await prisma.files.create({
        data: {
          url: fileUrl,
          fileType: 'blueprint',
          project_id: parseInt(projectId),
          user_id: userId,
        },
      });

      uploadedFiles.push(savedFile);
      fs.unlinkSync(file.path); // delete temp file
    }

    res.json({ message: 'Project folder uploaded', files: uploadedFiles });
  } catch (error) {
    console.error('❌ Folder Upload Error:', error);
    res.status(500).json({ message: 'Folder upload failed', error: error.message });
  }
};

module.exports = {
  generateSignedUrl,
  uploadMultipleFiles,
};

