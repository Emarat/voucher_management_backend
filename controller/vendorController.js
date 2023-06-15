const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
// const pool = require('./../config/db');
const {
  addVendor,
  getAllVendors,
  updateVendor,
  deleteVendor,
  deleteMultipleVendors,
  getAllVendorTypes,
} = require('../Query/vendorQueries');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Add a vendor
router.post('/vendor', async (req, res) => {
  try {
    const result = await addVendor(req.body);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Get all vendors
router.get('/vendor', async (req, res) => {
  try {
    const vendors = await getAllVendors();
    res.json(vendors);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Update a vendor
router.patch('/vendors/:id', async (req, res) => {
  try {
    const vendor = { vendor_id: req.params.id, ...req.body };
    const result = await updateVendor(vendor);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Delete a vendor
router.delete('/vendors/:id', async (req, res) => {
  try {
    const result = await deleteVendor(req.params.id);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Delete multiple vendors
router.delete('/vendors', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const result = await deleteMultipleVendors(ids);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Get all vendor types
router.get('/vendorType', async (req, res) => {
  try {
    const vendorTypes = await getAllVendorTypes();
    res.json(vendorTypes);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
