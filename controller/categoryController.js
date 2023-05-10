const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('./../config/db');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//route
router.route('/category')
    .post(async (req, res) => {
        try {
            const { category_name, category_description } = req.body;

            // Inserting data into PostgreSQL database
            const query =
                'INSERT INTO category (category_name, category_description) VALUES ($1, $2)';
            await pool.query(query, [category_name, category_description]);

            res.status(201).send('Category Added successfully!');
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })
    .get(async (req, res) => {
        try {
            const query = 'SELECT * FROM category';
            const results = await pool.query(query);
            res.json(results.rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })

module.exports = router;

