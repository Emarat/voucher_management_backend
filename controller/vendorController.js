const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('./../config/db');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//route
router
  .route('/vendor')
  //post vendor data
  .post(async (req, res) => {
    try {
      const {
        vendor_name,
        vendor_type,
        vendor_contact,
        vendor_number,
        status,
      } = req.body;

      const selectQuery =
        'SELECT * FROM vendor WHERE vendor_name = $1 AND vendor_type = $2 AND vendor_contact = $3 AND vendor_number = $4';
      const result = await pool.query(selectQuery, [
        vendor_name,
        vendor_type,
        vendor_contact,
        vendor_number,
      ]);

      if (result.rows.length > 0) {
        return res.status(400).send('Vendor already exists!');
      }

      // Inserting data into PostgreSQL database
      const insertQuery =
        'INSERT INTO vendor (vendor_name, vendor_type, vendor_contact, vendor_number, status) VALUES ($1, $2, $3, $4, $5)';
      await pool.query(insertQuery, [
        vendor_name,
        vendor_type,
        vendor_contact,
        vendor_number,
        status,
      ]);

      res.status(201).send('Vendor added successfully!');
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  })
  //get vendor data
  .get(async (req, res) => {
    try {
      const query =
        'SELECT v.*, vt.vendor_type_name FROM vendor v INNER JOIN vendor_type vt ON v.vendor_type = vt.vendor_type_id';
      const results = await pool.query(query);
      res.json(results.rows);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

//update vendor by id
router.patch('/vendors/:id', async (req, res) => {
  try {
    const { vendor_name, vendor_type, vendor_contact, vendor_number, status } =
      req.body;
    const { id } = req.params;

    const checkQuery = 'SELECT * FROM vendor WHERE vendor_id = $1';
    const { rows } = await pool.query(checkQuery, [id]);
    if (rows.length === 0) {
      return res.status(404).send('Vendor not found');
    }

    const updateQuery =
      'UPDATE vendor SET vendor_name = $1, vendor_type = $2, vendor_contact = $3, vendor_number = $4, status=$5 WHERE vendor_id = $6';
    await pool.query(updateQuery, [
      vendor_name,
      vendor_type,
      vendor_contact,
      vendor_number,
      status,
      id,
    ]);

    res.status(200).send('Vendor updated successfully!');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

//delete vendor by id

router.delete('/vendors/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const checkQuery = 'SELECT * FROM vendor WHERE vendor_id = $1';
    const { rows } = await pool.query(checkQuery, [id]);
    if (rows.length === 0) {
      return res.status(404).send('Vendor not found');
    }

    const deleteQuery = 'DELETE FROM vendor WHERE vendor_id = $1';
    await pool.query(deleteQuery, [id]);

    res.status(200).send('Vendor deleted successfully!');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

//delete multiple vendors by id
router.delete('/vendors', async (req, res) => {
  const vendorId = req.body.ids;
  console.log(vendorId);
  if (!Array.isArray(vendorId)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    let deletedCount = 0;
    for (const id of vendorId) {
      const result = await pool.query(
        'DELETE FROM vendor WHERE vendor_id = $1',
        [id]
      );

      if (result.rowCount >= 1) {
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      res.status(200).send('Successfully Deleted!');
    } else {
      res.status(404).json({ error: 'Vendors not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/vendorType', async (req, res) => {
  try {
    const query = 'SELECT * FROM vendor_type';
    const results = await pool.query(query);
    res.json(results.rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
