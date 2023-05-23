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
            const { name, category_id, status } = req.body;

            // Check if product already exists
            const checkQuery =
                'SELECT * FROM products WHERE name=$1 AND category_id=$2 AND status=$3';
            const checkResult = await pool.query(checkQuery, [name, category_id, status]);

            if (checkResult.rowCount > 0) {
                // Product already exists, send response
                res.status(400).send('Product already exists!');
            } else {
                // Insert new product into PostgreSQL database
                const insertQuery =
                    'INSERT INTO products (name, category_id, status) VALUES ($1, $2, $3)';
                await pool.query(insertQuery, [name, category_id, status]);

                res.status(201).send('Product added successfully!');
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })
    .get(async (req, res) => {
        try {
            const query = 'SELECT products.*,  category_name FROM products LEFT JOIN category ON products.category_id = category.category_id';
            const results = await pool.query(query);
            res.json(results.rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })

    .delete(async (req, res) => {
        try {
            // execute the PostgreSQL query to delete all products
            const result = await pool.query('DELETE FROM products');

            // return a success response if at least one row was deleted
            if (result.rowCount > 0) {
                res.status(200).send('Delete All Products Successfully');
            } else {
                // return a not found response if no rows were deleted
                res.status(404).json({ error: 'No products found' });
            }
        } catch (error) {
            // return a server error response if the query fails
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    });

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
});

//delete product by id
router.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        // execute the PostgreSQL query to delete the product by ID
        const result = await pool.query('DELETE FROM products WHERE id = $1', [productId]);

        if (result.rowCount >= 1) {
            // return a success response if one row was deleted
            res.status(200).send('Delete  Product Successfully');
        } else {
            // return a not found response if no rows were deleted
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        // return a server error response if the query fails
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

//delete multiple products by id
router.delete('/batchProducts', async (req, res) => {
    const productIds = req.body.ids;

    if (!Array.isArray(productIds)) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let deletedCount = 0;
        for (const id of productIds) {
            // execute the PostgreSQL query to delete the product by ID
            const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
            // console.log(result);

            if (result.rowCount >= 1) {
                deletedCount++;
            }
        }
        // console.log(deletedCount);

        if (deletedCount > 0) {
            // console.log(deletedCount);
            // return a success response if at least one row was deleted
            res.status(200).send('Successfully Deleted!');
        } else {
            // return a not found response if no rows were deleted
            res.status(404).json({ error: 'Products not found' });
        }
    } catch (error) {
        // return a server error response if the query fails
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});




//update products
router.patch('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, category_id, status } = req.body;

        // Updating data in PostgreSQL database
        const query =
            'UPDATE products SET name=$1, category_id=$2, status=$3 WHERE id=$4';
        await pool.query(query, [name, category_id, status, productId]);

        res.status(200).send('Product Updated successfully!');
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});


module.exports = router;

