// backend/config/config.js
module.exports = {
    MONGO_URI: process.env.MONGO_URI,           // e.g., from your .env file
    JWT_SECRET: process.env.JWT_SECRET || 'mysecretkey',
    ADMIN_CODE: process.env.ADMIN_CODE || 'adminsecret', // Secret code to allow admin signup
  };
  