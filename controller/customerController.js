const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('./../config/db');
const convertRes = require('../utils/customer_data_filter');
const {
  addProject,
  getProjectById,
  deleteProjectById,
  createCustomer,
  getCustomers,
  deleteCustomerById,
  getCustomerTypes,
  addCustomerType,
  deleteCustomerTypeById,
  updateCustomerTypeById,
  getCustomerMenuList,
  getProjectMenuList,
  getProjectsByCustomerId,
} = require('../Query/projectQueries');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//added projects
router.post('/projects', async (req, res) => {
  try {
    const { name, contact, customer_id } = req.body;
    await addProject(name, contact, customer_id);
    res.status(201).send('Project added successfully!');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

//get project by id
router.get('/projects/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectById(projectId);
    if (!project) {
      res.status(404).send('Project not found!');
    } else {
      res.status(200).json(project);
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
    const isDeleted = await deleteProjectById(projectId);
    if (!isDeleted) {
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
    //create customers
    try {
      const { name, contact, address, type } = req.body;
      await createCustomer(name, contact, address, type);
      res.status(201).send('Customer created successfully!');
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  })
  .get(async (req, res) => {
    // get customers
    try {
      const customers = await getCustomers();
      res.json(customers);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

//delete customer by id
router.delete('/customers/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    await deleteCustomerById(customerId);
    res.status(200).send('Customer Deleted Successfully!');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});
//customer type
router
  .route('/customerType')
  .get(async (req, res) => {
    try {
      const customerTypes = await getCustomerTypes();
      res.json(customerTypes);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  })
  .post(async (req, res) => {
    try {
      const { name } = req.body;
      await addCustomerType(name);
      res.status(200).send('Customer Type Added Successfully!');
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  })
  .delete(async (req, res) => {
    try {
      const { customer_type_id } = req.body;
      await deleteCustomerTypeById(customer_type_id);
      res.status(200).send('Customer Type Deleted Successfully!');
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  })
  .patch(async (req, res) => {
    try {
      const { customer_type_id, name } = req.body;
      await updateCustomerTypeById(customer_type_id, name);
      res.status(200).send('Customer Type Updated Successfully!');
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

//customer id, name
router.get('/customer-menu-list', async (req, res) => {
  try {
    const customerMenuList = await getCustomerMenuList();
    res.json(customerMenuList);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

//project id, name
router.get('/project-menu-list', async (req, res) => {
  try {
    const projectMenuList = await getProjectMenuList();
    res.json(projectMenuList);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

//specific projects by user id
router.get('/project-menu-list/:id', async (req, res) => {
  try {
    const customer_id = req.params.id;
    const projects = await getProjectsByCustomerId(customer_id);
    if (projects.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});
module.exports = router;
