
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const productRoutes = require('./routes/products');
const app = express();
const path = require('path');
// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Add these require statements at the top


// Load env vars
dotenv.config();

// Add cookie parser middleware (before routes)
app.use(cookieParser());


// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      errors: { image: err.message } 
    });
  } else if (err) {
    return res.status(500).json({ message: 'Server error' });
  }
  
  next();
});

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/productDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));