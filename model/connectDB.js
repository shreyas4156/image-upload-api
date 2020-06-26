require("dotenv").config();
const { Storage } = require("@google-cloud/storage");

const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(process.env.GCLOUD_APPLICATION_CREDENTIALS),
});
const db = admin.firestore();

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);

const createBlob = (file, res, next) => {
  const blob = bucket.file(file.originalname);

  // Create writable stream and specifying file mimetype
  const blobWriter = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  blobWriter.on("error", (err) => next(err));

  blobWriter.on("finish", () => {
    // Assembling public URL for accessing the file via HTTP
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURI(blob.name)}?alt=media`;
    const image = {
      imageUrl: publicUrl,
    };
    storeUrl(image);
    // Return the file name and its public URL
    res
      .status(200)
      .send({ fileName: file.originalname, fileLocation: publicUrl });
  });

  // When there is no more data to be consumed from the stream
  blobWriter.end(file.buffer);
};

const storeUrl = (image) => {
  db.collection("imageUrl")
    .doc("image")
    .set(image)
    .then(() => console.log("successfull"));
};

module.exports = createBlob;
