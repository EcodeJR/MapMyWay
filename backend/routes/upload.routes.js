const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/config');

let gfsBucket;

// Create a separate connection for GridFS
(async () => {
    try {
        const connection = await mongoose.createConnection(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority',
            ssl: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        // Wait for connection to be ready
        await new Promise((resolve, reject) => {
            connection.once('open', () => {
                console.log('MongoDB connection ready for GridFS');
                resolve();
            });
            connection.once('error', (err) => {
                console.error('MongoDB connection error:', err);
                reject(err);
            });
        });

        // Initialize GridFS bucket
        gfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
            bucketName: 'uploads'
        });

        console.log('GridFS bucket initialized successfully');

        // Add connection event listeners
        connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting to reconnect...');
        });

        connection.on('reconnected', () => {
            console.log('MongoDB reconnected successfully');
        });

    } catch (err) {
        console.error('GridFS initialization error:', err);
        // Don't exit process, let the application continue
    }
})();

// Route to get files by filename
router.get('/file/:filename', async (req, res) => {
    try {
        if (!gfsBucket) {
            throw new Error('GridFS not initialized');
        }

        const filename = req.params.filename;
        console.log(`Retrieving file: ${filename}`);

        const files = await gfsBucket.find({ filename }).toArray();
        
        if (!files || files.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'File not found' 
            });
        }

        res.set('Content-Type', files[0].contentType || 'application/octet-stream');
        res.set('Cache-Control', 'public, max-age=31557600'); // Cache for 1 year

        const downloadStream = gfsBucket.openDownloadStreamByName(filename);
        downloadStream.pipe(res);

    } catch (error) {
        console.error('File retrieval error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
});

// Add health check route
router.get('/health', (_, res) => {
    res.json({ 
        status: 'ok',
        gridfs: !!gfsBucket 
    });
});

module.exports = router;