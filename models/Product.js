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
  images: [{
    type: String,
    required: [true, 'Product images are required'],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.images;
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.images;
      return ret;
    }
  }
});

// Virtual for image URLs
productSchema.virtual('imageUrls').get(function() {
  if (this.images && this.images.length) {
    const baseUrl = (process.env.BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
    return this.images.map(image => {
      const imagePath = image.replace(/^[\\/]/, '').replace(/\\/g, '/');
      return `${baseUrl}/${imagePath}`;
    });
  }
  return [];
});

// Middleware to ensure consistency
productSchema.pre('save', function(next) {
  if (this.isModified('images')) {
    this.images = this.images.map(image => image.replace(/\\/g, '/'));
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);