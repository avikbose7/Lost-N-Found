const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const User = require('../models/User'); // Import User model
const auth = require('../middleware/auth'); // Import auth middleware
const multer = require('multer'); // Import multer

// -- FIX --
// Configure multer to expect a single file field named 'image',
// as well as any text fields.
// We'll store the file in memory for now (since we're not saving it yet)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');
// -- END FIX --

// === CREATE a new item (POST) ===
// This route is now protected and uses the updated multer config
router.post('/', auth, upload, async (req, res) => {
  try {
    // Get form data from req.body (parsed by multer)
    const { title, description, category, location, contactInfo, status } = req.body;
    
    // req.file would contain the image if we were saving it
    // console.log(req.file); 
    
    // Get user's ID from the auth middleware
    const reporterId = req.user.id;
    
    // Find the user's name
    const user = await User.findById(reporterId).select('name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newItem = new Item({
      title,
      description,
      category,
      location,
      contactInfo,
      status, // 'lost' or 'found'
      reporterId: reporterId,
      reportedBy: user.name, // Save the user's name for display
      dateReported: new Date(),
      // We are not saving req.file.buffer to a CDN or our server yet
      // imageUrl: ... 
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);

  } catch (error) {
    console.error('Error creating item:', error.message);
    res.status(400).json({ message: error.message });
  }
});


// === READ all items (GET) ===
// This route remains public
router.get('/', async (req, res) => {
  try {
    // Sort by dateReported descending to show newest items first
    const items = await Item.find().sort({ dateReported: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// === READ a single item by ID (GET) ===
// This route remains public
router.get('/:id', async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});


// === UPDATE an item by ID (PUT/PATCH) ===
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // This option returns the updated document
    );
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// === DELETE an item by ID (DELETE) ===
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;