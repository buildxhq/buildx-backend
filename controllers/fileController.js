const s3 = require('../config/s3');

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `uploads/${Date.now()}-${req.file.originalname}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };

        const data = await s3.upload(params).promise();
        res.json({ message: 'File uploaded successfully', fileUrl: data.Location });

    } catch (error) {
        console.error('S3 Upload Error:', error);
        res.status(500).json({ message: 'File upload failed' });
    }
};

module.exports = { uploadFile };
