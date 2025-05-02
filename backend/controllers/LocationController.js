// backend/controllers/LocationController.js
const Location = require('../models/Location');

// Create a new location (admin only)
// backend/controllers/LocationController.js
// Updated controller function for createLocation
exports.createLocation = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (req.file) {
      // Construct a URL to access the image from GridFS
      req.body.imageUrl = `${req.protocol}://${req.get('host')}/api/uploads/file/${req.file.filename}`;
    }
    
    // Create the new location with the updated body
    const newLocation = await Location.create(req.body);
    
    res.status(201).json({
      success: true,
      data: newLocation
    });
  } catch (err) {
    console.error('Error creating location:', err);
    res.status(400).json({ 
      success: false,
      message: err.message || 'Failed to create location'
    });
  }
};
  

// Get all locations (public)
exports.getLocations = async (req, res) => {
  try {
    const query = req.query.q ? { name: new RegExp(req.query.q, 'i') } : {};
    const locations = await Location.find(query);
    res.json(locations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
    console.log(err);
  }
};

// Update a location (admin only)
exports.updateLocation = async (req, res) => {
  try {
    const updated = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// Delete a location (admin only)
exports.deleteLocation = async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Location deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
