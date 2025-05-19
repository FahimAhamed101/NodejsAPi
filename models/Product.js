const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['electronics', 'clothing', 'home', 'books'],
      message: 'Invalid category',
    },
  },
  image: {
    type: String,
    required: [true, 'Product image is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Remove the original image path when virtual is present
      delete ret.image;
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.image;
      return ret;
    }
  }
});

// Virtual for image URL - using different name to avoid conflict
productSchema.virtual('imageUrl').get(function() {
  if (this.image) {
    // Normalize the URL construction
    const baseUrl = (process.env.BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
    const imagePath = this.image.replace(/^[\\/]/, '').replace(/\\/g, '/');
    
    return `${baseUrl}/${imagePath}`;
  }
  return null;
});

// Middleware to ensure consistency
productSchema.pre('save', function(next) {
  if (this.isModified('image')) {
    this.image = this.image.replace(/\\/g, '/');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);