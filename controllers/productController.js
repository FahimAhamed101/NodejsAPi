const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');
// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        errors: { images: 'At least one product image is required' } 
      });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      images: req.files.map(file => file.path),
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({ errors });
    }
    
    // Handle other errors
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    
    // Find the existing product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Prepare update data
    const updateData = {
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      category: category || product.category,
    };

    // Handle image updates if new files are uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images from filesystem
      product.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
      
      // Add new images
      updateData.images = req.files.map(file => file.path);
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({ errors });
    }
    
    // Handle cast errors (invalid ID format)
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    
    // Handle other errors
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};