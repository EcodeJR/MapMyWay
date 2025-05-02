// backend/models/Location.js
const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  description: { type: String },
  imageUrl: { type: String }, // URL for uploaded image (if any)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Location', LocationSchema);
