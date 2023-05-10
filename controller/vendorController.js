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

module.exports = router;

