const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('./../config/db');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//post route
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

//get products by using category_id
router.get('/category/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const query = 'SELECT * FROM category WHERE category_id = $1';
        const results = await pool.query(query, [categoryId]);
        res.json(results.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

//update catagory
router.patch('/category/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { category_name, category_description, status } = req.body;

        // Updating data in PostgreSQL database
        const query =
            'UPDATE category SET category_name=$1, category_description=$2, status=$3 WHERE category_id=$4';
        await pool.query(query, [category_name, category_description, status, categoryId]);

        res.status(200).send('Category Updated successfully!');
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

module.exports = router;

