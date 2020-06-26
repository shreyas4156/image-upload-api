require("dotenv").config();
const express = require("express");
const multer = require("multer");
const gcsSharp = require("multer-sharp");
const createBlob = require("../model/connectDB");
// Setup upload.
const storage = gcsSharp({
  bucket: process.env.GCLOUD_STORAGE_BUCKET_URL, // Required : bucket name to upload
  projectId: process.env.GCLOUD_PROJECT_ID, // Required : Google project ID
  keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS, // Optional : JSON credentials file for Google Cloud Storage
  size: {
    width: 400,
    height: 400,
  },
  max: true,
});
const upload = multer({ storage: storage });

// Get request handler for '/' path.
const router = express.Router();

// Upload file handler with '/api/photo' path.
router.post("/", upload.single("photo"), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }

    createBlob(req.file, res, next);
    // This is where we'll upload our file to Cloud Storage
  } catch (error) {
    res.status(400).send(`Error, could not upload file: ${error}`);
    return;
  }
});

module.exports = router;
