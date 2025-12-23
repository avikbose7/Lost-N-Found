const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');
const auth = require('../middleware/auth'); // Needed for user context? Keep for now, maybe remove later if unused.
const adminAuth = require('../middleware/adminAuth');
const bcrypt = require('bcryptjs'); // Needed for creating/updating users

// --- Dashboard Stats ---
// @route   GET /api/admin/stats
// @desc    Get dashboard stats
// @access  Admin
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    const pendingClaims = await Claim.countDocuments({ status: 'pending' });
    const unverifiedItems = await Item.countDocuments({ verified: false });
    const resolvedClaims = await Claim.countDocuments({ status: { $ne: 'pending' } });

    res.json({
      totalItems,
      pendingClaims,
      unverifiedItems,
      resolvedClaims,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- Claim Management ---
// @route   GET /api/admin/claims
// @desc    Get all claims
// @access  Admin
router.get('/claims', adminAuth, async (req, res) => {
  try {
    const claims = await Claim.find().sort({ dateSubmitted: -1 });
    res.json(claims);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/claims/:id
// @desc    Approve or reject a claim
// @access  Admin
router.put('/claims/:id', adminAuth, async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'

  if (status !== 'approved' && status !== 'rejected') {
    return res.status(400).json({ msg: 'Invalid status' });
  }

  try {
    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!claim) return res.status(404).json({ msg: 'Claim not found' });
    res.json(claim);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- Item Management ---
// @route   GET /api/admin/items
// @desc    Get all items
// @access  Admin
router.get('/items', adminAuth, async (req, res) => {
  try {
    const items = await Item.find().sort({ dateReported: -1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/items/:id/verify
// @desc    Toggle item verification
// @access  Admin
router.put('/items/:id/verify', adminAuth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Item not found' });

    item.verified = !item.verified; // Toggle the status
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// --- User Management ---

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', adminAuth, async (req, res) => {
  try {
    // Exclude password from the result
    const users = await User.find().select('-password').sort({ name: 1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/admin/users
// @desc    Create a new user
// @access  Admin
router.post('/users', adminAuth, async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  // Basic validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please provide name, email, password, and role.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Create new user instance (password will be hashed by pre-save hook in User model)
    user = new User({
      name,
      email,
      phone,
      password,
      role,
    });

    await user.save();

    // Return the newly created user (excluding password)
    const userToReturn = user.toObject();
    delete userToReturn.password;
    res.status(201).json(userToReturn);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update a user's details (excluding password)
// @access  Admin
router.put('/users/:id', adminAuth, async (req, res) => {
  const { name, email, phone, role } = req.body;
  const userId = req.params.id;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email; // Add validation if email needs to remain unique
    if (phone !== undefined) user.phone = phone; // Allow setting phone to empty string
    if (role) user.role = role;

    // Password updates should be handled separately for security
    
    await user.save();

    // Return the updated user (excluding password)
    const userToReturn = user.toObject();
    delete userToReturn.password;
    res.json(userToReturn);

  } catch (err) {
    console.error(err.message);
    // Handle potential duplicate email error if you enforce uniqueness on update
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Admin
router.delete('/users/:id', adminAuth, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Consider implications: what happens to items/claims reported by this user?
    // For now, just delete the user.
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;