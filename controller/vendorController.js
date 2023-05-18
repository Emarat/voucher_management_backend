const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('./../config/db');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//route
router.route('/vendor')
    //post vendor data
    .post(async (req, res) => {
        try {
            const { vendor_name, vendor_type, vendor_contact, vendor_number, status } = req.body;

            // Inserting data into PostgreSQL database
            const query =
                'INSERT INTO vendor (vendor_name, vendor_type, vendor_contact, vendor_number, status) VALUES ($1, $2, $3, $4, $5)';
            await pool.query(query, [vendor_name, vendor_type, vendor_contact, vendor_number, status]);

            res.status(201).send('Vendor Added successfully!');
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })
    //get vendor data
    .get(async (req, res) => {
        try {
            const query = 'SELECT * FROM vendor';
            const results = await pool.query(query);
            res.json(results.rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })

//update vendor by id
router.patch('/vendors/:id', async (req, res) => {
    try {
        const { vendor_name, vendor_type, vendor_contact, vendor_number, status } = req.body;
        const { id } = req.params;

        // Checking if the vendor exists
        const checkQuery = 'SELECT * FROM vendor WHERE vendor_id = $1';
        const { rows } = await pool.query(checkQuery, [id]);
        if (rows.length === 0) {
            return res.status(404).send('Vendor not found');
        }

        // Updating vendor data in PostgreSQL database
        const updateQuery =
            'UPDATE vendor SET vendor_name = $1, vendor_type = $2, vendor_contact = $3, vendor_number = $4, status=$5 WHERE vendor_id = $6';
        await pool.query(updateQuery, [vendor_name, vendor_type, vendor_contact, vendor_number, status, id]);

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

        // Checking if the vendor exists
        const checkQuery = 'SELECT * FROM vendor WHERE vendor_id = $1';
        const { rows } = await pool.query(checkQuery, [id]);
        if (rows.length === 0) {
            return res.status(404).send('Vendor not found');
        }

        // Deleting the vendor from PostgreSQL database
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
            // execute the PostgreSQL query to delete the product by ID
            const result = await pool.query('DELETE FROM vendor WHERE vendor_id = $1', [id]);

            if (result.rowCount >= 1) {
                deletedCount++;
            }
        }

        if (deletedCount > 0) {
            // return a success response if at least one row was deleted
            res.status(200).send('Successfully Deleted!');
        } else {
            // return a not found response if no rows were deleted
            res.status(404).json({ error: 'Vendors not found' });
        }
    } catch (error) {
        // return a server error response if the query fails
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;

