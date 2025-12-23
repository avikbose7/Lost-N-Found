const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true, enum: ['lost', 'found'] },
  dateReported: { type: Date, default: Date.now },
  location: { type: String, required: true },
  
  // -- UPDATED & NEW FIELDS --
  reportedBy: { type: String }, // For seed data/display name
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Links to the user who reported it
  contactInfo: { type: String }, // New field from the form
  imageUrl: { type: String, default: '' }, // For when you add image uploads
  verified: { type: Boolean, default: false },
  // -- END UPDATES --

  createdAt: { type: Date, default: Date.now },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;