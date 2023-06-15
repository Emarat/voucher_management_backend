const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
// const pool = require('./../config/db');
const {
  addProduct,
  getAllProducts,
  deleteAllProducts,
  getProductsByCategory,
  deleteProductById,
  deleteMultipleProducts,
  updateProduct,
} = require('../Query/productQueries');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Add product
router.post('/products', async (req, res) => {
  try {
    const { name, category_id, status } = req.body;
    await addProduct(name, category_id, status);
    res.status(201).send('Product added successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Delete all products
router.delete('/products', async (req, res) => {
  try {
    const result = await deleteAllProducts();
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Get products by category_id
router.get('/products/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const products = await getProductsByCategory(categoryId);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Delete product by id
router.delete('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await deleteProductById(productId);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Delete multiple products by id
router.delete('/batchProducts', async (req, res) => {
  try {
    const productIds = req.body.ids;
    if (!Array.isArray(productIds)) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    const result = await deleteMultipleProducts(productIds);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Update product
router.patch('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, category_id, status } = req.body;
    const result = await updateProduct(productId, name, category_id, status);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
