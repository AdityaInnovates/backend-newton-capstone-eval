var express = require("express");
var router = express.Router();
const fs = require("fs");
const { google } = require("googleapis");
const multer = require("multer");
const KEY_FILE_PATH = "./newton-capstone-16651134b8d1.json";
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

    const fileId = response.data.id;

    // Set the file's permissions to allow sharing (optional: adjust role and type)
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader", // 'reader' for view-only, 'writer' for edit permissions
        type: "anyone", // 'anyone' makes it public; use 'user' for specific users
      },
    });

    const fileInfo = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
    return fileInfo.data.webContentLink;
    return {
      webViewLink: fileInfo.data.webViewLink, // Link to view in the browser
      webContentLink: fileInfo.data.webContentLink, // Link to download/stream the file
    };

    // Get the sharable link
    const fileLink = `https://drive.google.com/file/d/${fileId}/view`;

    return fileLink;
  } catch (error) {
    console.error("Error uploading to Google Drive:", error.message);
    throw error;
  }
}
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        status: false,
        message: "No file uploaded.",
      });
    }

    const videoLink = await uploadFileToDrive(
      req.file.path,
      req.file.originalname
    );

    fs.unlinkSync(req.file.path);

    res.status(200).send({
      status: true,
      message: "File uploaded successfully!",
      videoLink,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      error: error.message,
    });
  }
});
module.exports = router;
