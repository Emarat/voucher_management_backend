const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('./../config/db');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.route('/customers')
    .post(async (req, res) => {
        try {
            const { name, contact, address, type } = req.body;

            // Inserting data into PostgreSQL database
            const query =
                'INSERT INTO customers (name, contact, address, type) VALUES ($1, $2, $3, $4)';
            await pool.query(query, [name, contact, address, type]);

            res.status(201).send('Customer created successfully!');
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })
    .get(async (req, res) => {
        try {
            const query = 'SELECT * FROM customers';
            const results = await pool.query(query);
            res.json(results.rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })

module.exports = router;

