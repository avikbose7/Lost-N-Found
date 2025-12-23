// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  exposedHeaders: ['x-auth-token'], // Expose the token header
}));

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON in the request body

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Successfully connected to MongoDB Atlas! ✅'))
.catch(err => console.error('Error connecting to MongoDB Atlas:', err));

const itemRoutes = require('./routes/items');
const authRoutes = require('./routes/auth');
const claimRoutes = require('./routes/claims'); // <-- ADD THIS
const adminRoutes = require('./routes/admin'); // <-- ADD THIS

// Use Routes
app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/claims', claimRoutes); // <-- ADD THIS
app.use('/api/admin', adminRoutes); // <-- ADD THIS


// A simple test route
app.get('/', (req, res) => {
  res.send('<h1>Backend Server is Running!</h1>');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});