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
});

//get projects by id
router.get('/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id;

        // Retrieving data from PostgreSQL database
        const query = 'SELECT * FROM projects WHERE project_id=$1';
        const result = await pool.query(query, [projectId]);

        if (result.rows.length === 0) {
            res.status(404).send('Project not found!');
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

//delete project by id
router.delete('/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id;

        // Deleting data from PostgreSQL database
        const query = 'DELETE FROM projects WHERE project_id=$1';
        const result = await pool.query(query, [projectId]);

        if (result.rowCount === 0) {
            res.status(404).send('Project not found!');
        } else {
            res.status(200).send('Project deleted successfully!');
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});



//route
router.route('/customers')
    .post(async (req, res) => {
        try {
            const { name, contact, address, type } = req.body;

            // Checking if customer already exists in PostgreSQL database
            const selectQuery =
                'SELECT * FROM customers WHERE name = $1 AND contact = $2';
            const { rows } = await pool.query(selectQuery, [name, contact]);

            if (rows.length > 0) {
                return res.status(400).send('Customer already exists!');
            }

            // Inserting data into PostgreSQL database
            const insertQuery =
                'INSERT INTO customers (name, contact, address, type) VALUES ($1, $2, $3, $4)';
            await pool.query(insertQuery, [name, contact, address, type]);

            res.status(201).send('Customer created successfully!');
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })
    .get(async (req, res) => {
        try {

            const query = 'SELECT customers.customer_id, customers.name AS customer_name, customers.contact AS customer_contact, customers.address AS customer_address, customers.type AS customer_type ,projects.name AS project_name, projects.contact AS project_contact, projects.project_id FROM customers LEFT JOIN projects ON customers.customer_id = projects.customer_id'
            const results = await pool.query(query);
            const customers = convertRes(results.rows);
            res.json(customers);
            // console.log(results.rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    });

//delete customer by id
router.delete('/customers/:id', async (req, res) => {
    try {
        const customerId = req.params.id;
        //delete from postgres db
        const query = 'DELETE FROM customers WHERE customer_id=$1';
        await pool.query(query, [customerId]);

        res.status(200).send('Customer Deleted Successfully!');
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});


//get customer type
//route
router.route('/customerType')
    .get(async (req, res) => {
        try {
            const query = 'SELECT * FROM customer_type';
            const results = await pool.query(query);
            res.json(results.rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    })



module.exports = router;

