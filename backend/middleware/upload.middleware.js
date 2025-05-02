// backend/middleware/upload.middleware.js
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const crypto = require('crypto');
const { MONGO_URI } = require('../config/config');

// Create GridFS storage engine
const storage = new GridFsStorage({
  url: MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // Generate a random name for the file
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
       
        const filename = buf.toString('hex') + '-' + Date.now() + path.extname(file.originalname);
       
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads' // This will be the name of the GridFS collection
        };
       
        resolve(fileInfo);
      });
    });
  }
});

// Set up multer with file limits and filtering if needed
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Check file types
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
   
    cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'));
  }
});

module.exports = upload;