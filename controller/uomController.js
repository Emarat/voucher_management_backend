const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
// const pool = require('./../config/db');
const { getAllUOMs } = require('../Query/uomQueries');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Get all UOMs
router.get('/uom', async (req, res) => {
  try {
    const uomList = await getAllUOMs();
    res.json(uomList);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
