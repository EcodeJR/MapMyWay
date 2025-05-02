// backend/routes/upload.routes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/config');

let gfsBucket;
const connection = mongoose.createConnection(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connection.asPromise()
  .then(() => {
    gfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
      bucketName: 'uploads'
    });
    console.log('GridFS connection established');
  })
  .catch(err => {
    console.error('GridFS connection error:', err);
  });

// Route to get files by filename
router.get('/file/:filename', (req, res) => {
  if (!gfsBucket) {
    console.error('GridFS bucket is not initialized.');
    return res.status(500).json({ message: 'File system not initialized' });
  }

  const filename = req.params.filename;
  console.log(`Retrieving file: ${filename}`);

  // Use promises instead of callbacks for better error handling
  gfsBucket.find({ filename: filename }).toArray()
    .then(files => {
      if (!files || files.length === 0) {
        console.error(`File not found: ${filename}`);
        return res.status(404).json({ message: 'File not found' });
      }
      
      console.log('File found:', files[0]);
      res.set('Content-Type', files[0].contentType || 'application/octet-stream');
      
      const downloadStream = gfsBucket.openDownloadStreamByName(filename);
      
      downloadStream.on('error', (error) => {
        console.error('Error in download stream:', error);
        return res.status(500).json({ message: error.message });
      });
      
      downloadStream.pipe(res);
    })
    .catch(err => {
      console.error('Error during file search:', err);
      return res.status(500).json({ message: err.message });
    });
});

module.exports = router;