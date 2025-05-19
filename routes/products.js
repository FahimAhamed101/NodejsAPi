const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

router.get('/', getProducts);
router.get('/:id', getProductById);

// Create a product - now handles multiple images
router.post('/', upload.array('images', 5), productController.createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;