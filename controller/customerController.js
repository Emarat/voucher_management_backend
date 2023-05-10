const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('./../config/db');
const convertRes = require('../utils/customer_data_filter');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());




//added projects
router.post('/projects', async (req, res) => {
    try {
        const { name, contact, customer_id } = req.body;

        // Inserting data into PostgreSQL database
        const query =
            'INSERT INTO projects (name, contact, customer_id) VALUES ($1, $2, $3)';
        await pool.query(query, [name, contact, customer_id]);

        res.status(201).send('Projects Added successfully!');
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

//route
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

            const query = 'SELECT customers.customer_id, customers.name AS customer_name, customers.contact AS customer_contact, customers.address AS customer_address, customers.type AS customer_type ,projects.name AS project_name, projects.contact AS project_contact, projects.project_id FROM customers INNER JOIN projects ON customers.customer_id = projects.customer_id '
            const results = await pool.query(query);
            const customers = convertRes(results.rows);
            res.json(customers);
            // console.log(results.rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })



module.exports = router;

