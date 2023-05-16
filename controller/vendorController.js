const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('./../config/db');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//route
router.route('/vendor')
    .post(async (req, res) => {
        try {
            const { vendor_name, vendor_type, vendor_contact, vendor_number } = req.body;

            // Inserting data into PostgreSQL database
            const query =
                'INSERT INTO vendor (vendor_name, vendor_type, vendor_contact, vendor_number) VALUES ($1, $2, $3, $4)';
            await pool.query(query, [vendor_name, vendor_type, vendor_contact, vendor_number]);

            res.status(201).send('Vendor Added successfully!');
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })
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


module.exports = router;

