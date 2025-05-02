// backend/routes/location.routes.js
const express = require('express');
const router = express.Router();
const { 
    createLocation, 
    getLocations, 
    updateLocation, 
    deleteLocation 
} = require('../controllers/LocationController');
const { verifyToken, checkAdmin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Public route: view locations
router.get('/', getLocations);
router.get('/GetLocation', getLocations);

// Admin-only routes: create, update, delete locations
// Here we use multer-gridfs-storage to handle image uploads
router.post('/AddLocation', verifyToken, checkAdmin, upload.single('image'), createLocation);
router.put('/:id', verifyToken, checkAdmin, updateLocation);
router.delete('/:id', verifyToken, checkAdmin, deleteLocation);

module.exports = router;
