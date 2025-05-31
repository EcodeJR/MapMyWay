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
    // console.log(err);
  }
};

// Update a location (admin only)
exports.updateLocation = async (req, res) => {
  try {
    // Handle file upload if present
    if (req.file) {
      req.body.imageUrl = `${req.protocol}://${req.get('host')}/api/uploads/file/${req.file.filename}`;
    }

    // Parse coordinates from form data
    if (req.body['coordinates[lat]'] && req.body['coordinates[lng]']) {
      req.body.coordinates = {
        lat: parseFloat(req.body['coordinates[lat]']),
        lng: parseFloat(req.body['coordinates[lng]'])
      };
      // Remove the original form data fields
      delete req.body['coordinates[lat]'];
      delete req.body['coordinates[lng]'];
    }

    const updated = await Location.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: 'Location not found' });
    }

    res.json({
      success: true,
      data: updated
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(400).json({ 
      success: false,
      msg: err.message || 'Failed to update location'
    });
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
