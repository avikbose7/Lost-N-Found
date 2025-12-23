const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// --- User Registration (Sign Up) ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Create a new user instance (password will be hashed by middleware)
    user = new User({ name, email, phone, password, role });
    await user.save();

    // Create JWT Payload
    const payload = {
      user: { id: user.id, role: user.role }
    };

    // Sign the token
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      // Send token and user info (without password) back to the client
      res.status(201).json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// --- User Login ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Compare submitted password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Create and sign JWT
        const payload = {
            user: { id: user.id, role: user.role }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role }
            });
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});
// --- Get Logged In User ---
// @route   GET /api/auth
// @desc    Get logged in user data (from token)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // req.user is attached by the auth middleware
    // We fetch from DB to get the latest user data, excluding the password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;