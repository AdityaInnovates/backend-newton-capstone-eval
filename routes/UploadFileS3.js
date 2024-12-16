var express = require("express");
var router = express.Router();
const fs = require("fs");
const multer = require("multer");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 500 * 1024 * 1024 },
});

// Custom error handler for multer
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: false,
      message: "File too large. Maximum size allowed is 500 MB.",
    });
  }
  next(err);
};

router.post(
  "/uploadS3",
  upload.single("video"),
  multerErrorHandler,
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ status: false, message: "No file uploaded" });
      }
      const s3Client = new S3Client({
        endpoint: process.env.OLAKRUTRIM_BASE_URL,
        region: process.env.OLAKRUTRIM_REGION,
        s3ForcePathStyle: true,
        credentials: {
          accessKeyId: process.env.OLAKRUTRIM_ACCESS_KEY,
          secretAccessKey: process.env.OLAKRUTRIM_SECRET_KEY,
        },
        forcePathStyle: true,
      });

      const command = new PutObjectCommand({
        Bucket: process.env.OLAKRUTRIM_BUCKET_NAME,
        Key: req.file.originalname + Math.floor(Math.random() * 9999),
        Body: fs.createReadStream(req.file.path),
      });

      const response = await s3Client.send(command);
      // console.log(response);

      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Failed to delete local file:", err);
        }
      });

      const signedUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: process.env.OLAKRUTRIM_BUCKET_NAME,
          Key: req.file.originalname,
        })
        // { expiresIn: 3600 }
      );

      res.json({
        message: "File uploaded successfully",
        data: response,
        videoLink: signedUrl,
      });
    } catch (error) {
      if (
        error instanceof multer.MulterError &&
        error.code === "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          message: "File too large. Maximum size allowed is 500MB.",
        });
      }
      res.status(500).json({
        message: "Upload failed",
        error: error.message,
      });
    }
  }
);

module.exports = router;
