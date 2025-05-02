// backend/controllers/AuthController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, ADMIN_CODE } = require('../config/config');

// Signup: registers a new user (admin registration requires a matching adminCode)
exports.Signup = async (req, res) => {
  const { username, email, password, role, adminCode } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ msg: 'User already exists' });

    // If registering as admin, validate the adminCode
    if (role === 'admin') {
      if (adminCode !== ADMIN_CODE) {
        return res.status(403).json({ msg: 'Invalid admin code' });
      }
    }

    user = new User({ username, email, password, role });
    await user.save();

    const payload = { user: { id: user._id } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: "3d" }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token, username, msg: 'User registered successfully' });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Login: authenticate user and return JWT token
exports.Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user._id } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: '3d' }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ 
        token, 
        role: user.role,
        msg: 'Logged in successfully',
        username: user.username });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
