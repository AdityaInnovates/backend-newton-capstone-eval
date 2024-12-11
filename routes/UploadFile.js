var express = require("express");
var router = express.Router();
const fs = require("fs");
const { google } = require("googleapis");
const multer = require("multer");
const KEY_FILE_PATH = "path/to/your-service-account-key.json"; // Replace with your JSON key file
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

// Configure Google Auth
const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES,
});

// Create Google Drive API client
const drive = google.drive({ version: "v3", auth });
const upload = multer({ dest: "uploads/" });

async function uploadFileToDrive(filePath, fileName) {
  try {
    const fileMetadata = {
      name: fileName, // Desired name in Google Drive
    };

    const media = {
      mimeType: "video/mp4",
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    return response.data.id;
  } catch (error) {
    console.error("Error uploading to Google Drive:", error.message);
    throw error;
  }
}
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const fileId = await uploadFileToDrive(
      req.file.path,
      req.file.originalname
    );

    // Cleanup: Remove the file from the local uploads directory
    fs.unlinkSync(req.file.path);

    res.status(200).send({ message: "File uploaded successfully!", fileId });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
module.exports = router;
