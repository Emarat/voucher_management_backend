const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('./../config/db');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.route('/products')
    .post(async (req, res) => {
        try {
            const { name } = req.body;

            // Inserting data into PostgreSQL database
            const query =
                'INSERT INTO products (name) VALUES ($1)';
            await pool.query(query, [name]);

            res.status(201).send('Product Added successfully!');
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })
    .get(async (req, res) => {
        try {
            const query = 'SELECT * FROM products';
            const results = await pool.query(query);
            res.json(results.rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })

module.exports = router;

