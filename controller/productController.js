const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('./../config/db');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//route
router.route('/products')
    .post(async (req, res) => {
        try {
            const { name, category_id } = req.body;

            // Inserting data into PostgreSQL database
            const query =
                'INSERT INTO products (name, category_id) VALUES ($1, $2)';
            await pool.query(query, [name, category_id]);

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

//get products by using category_id
router.get('/products/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const query = 'SELECT * FROM products WHERE category_id = $1';
        const results = await pool.query(query, [categoryId]);
        res.json(results.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

module.exports = router;

