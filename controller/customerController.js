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
router
  .route('/customers')
  .post(async (req, res) => {
    try {
      const { name, contact, address, type } = req.body;

      const selectQuery =
        'SELECT * FROM customers WHERE name = $1 AND contact = $2';
      const { rows } = await pool.query(selectQuery, [name, contact]);

      if (rows.length > 0) {
        return res.status(400).send('Customer already exists!');
      }

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
      const query =
        'SELECT customers.customer_id, customers.name AS customer_name, customers.contact AS customer_contact, customers.address AS customer_address, customers.type AS customer_type ,projects.name AS project_name, projects.contact AS project_contact, projects.project_id FROM customers LEFT JOIN projects ON customers.customer_id = projects.customer_id';
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
router
  .route('/customerType')
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
  .post(async (req, res) => {
    try {
      const { name } = req.body;

      const query =
        'INSERT INTO customer_type (customer_type_name) VALUES ($1)';
      const values = [name];
      await pool.query(query, values);

      res.status(200).send('Customer Type Added Successfully!');
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  })
  .delete(async (req, res) => {
    try {
      const { customer_type_id } = req.body;

      const query = 'DELETE FROM customer_type WHERE customer_type_id = $1';
      const values = [customer_type_id];
      await pool.query(query, values);

      res.status(200).send('Customer Type Deleted Successfully!');
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  })
  .patch(async (req, res) => {
    try {
      const { customer_type_id, name } = req.body;

      const query =
        'UPDATE customer_type SET customer_type_name = $1 WHERE customer_type_id = $2';
      const values = [name, customer_type_id];
      await pool.query(query, values);

      res.status(200).send('Customer Type Updated Successfully!');
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

//customer id, name
router.get('/customer-menu-list', async (req, res) => {
  try {
    const query = 'SELECT name, customer_id FROM customers';
    const results = await pool.query(query);
    res.json(results.rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

//project id, name
router.get('/project-menu-list', async (req, res) => {
  try {
    const query = 'SELECT name, project_id FROM projects';
    const results = await pool.query(query);
    res.json(results.rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

//specific projects by user id
router.get('/project-menu-list/:id', async (req, res) => {
  try {
    const customer_id = req.params.id;
    const query =
      'SELECT name , project_id FROM projects WHERE customer_id = $1';
    const result = await pool.query(query, [customer_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
