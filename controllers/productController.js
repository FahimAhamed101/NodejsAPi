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
    
    if (!req.file) {
      return res.status(400).json({ 
        errors: { image: 'Product image is required' } 
      });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image: req.file.path,
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
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
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