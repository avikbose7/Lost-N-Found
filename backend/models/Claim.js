const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  // Reference to the item being claimed
  item: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item', 
    required: true 
  },
  
  // Reference to the user making the claim
  claimer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Denormalized data for easy display in admin panel
  itemTitle: { type: String, required: true },
  claimerName: { type: String, required: true },
  claimerEmail: { type: String, required: true },
  
  // Claim status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
});

const Claim = mongoose.model('Claim', claimSchema);
module.exports = Claim;
