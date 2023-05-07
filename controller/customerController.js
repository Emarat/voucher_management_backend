const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('./../config/db');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/customers', async (req, res) => {
    try {
        const { name, pointOfContact, address, type } = req.body;

        // Inserting data into PostgreSQL database
        const query =
            'INSERT INTO customers (name, point_of_contact, address, type) VALUES ($1, $2, $3, $4)';
        await pool.query(query, [name, pointOfContact, address, type]);

        res.status(201).send('Customer created successfully!');
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

module.exports = router;

