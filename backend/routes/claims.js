const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Claim = require('../models/Claim');
const User = require('../models/User');
const Item = require('../models/Item');

// @route   POST /api/claims
// @desc    Create a new claim for an item
// @access  Private
router.post('/', auth, async (req, res) => {
  const { itemId } = req.body;
  const claimerId = req.user.id;

  try {
    const user = await User.findById(claimerId);
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Check if user has already claimed this item
    const existingClaim = await Claim.findOne({ item: itemId, claimer: claimerId });
    if (existingClaim) {
      return res.status(400).json({ msg: 'You have already submitted a claim for this item' });
    }

    const newClaim = new Claim({
      item: itemId,
      claimer: claimerId,
      itemTitle: item.title,
      claimerName: user.name,
      claimerEmail: user.email,
    });

    await newClaim.save();
    res.status(201).json(newClaim);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;