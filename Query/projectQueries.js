const pool = require('./../config/db');

//add projects
async function addProject(name, contact, customerId) {
  const query =
    'INSERT INTO projects (name, contact, customer_id) VALUES ($1, $2, $3)';
  await pool.query(query, [name, contact, customerId]);
}
//getProjectById
async function getProjectById(projectId) {
  const query = 'SELECT * FROM projects WHERE project_id=$1';
  const result = await pool.query(query, [projectId]);
  return result.rows.length === 0 ? null : result.rows[0];
}

//deleteProjectById
async function deleteProjectById(projectId) {
  const query = 'DELETE FROM projects WHERE project_id=$1';
  const result = await pool.query(query, [projectId]);
  return result.rowCount === 0 ? false : true;
}

//create customer
async function createCustomer(name, contact, address, type) {
  const selectQuery =
    'SELECT * FROM customers WHERE name = $1 AND contact = $2';
  const { rows } = await pool.query(selectQuery, [name, contact]);

  if (rows.length > 0) {
    throw new Error('Customer already exists!');
  }

  const insertQuery =
    'INSERT INTO customers (name, contact, address, type) VALUES ($1, $2, $3, $4)';
  await pool.query(insertQuery, [name, contact, address, type]);
}

//get customer
async function getCustomers() {
  const query = `SELECT customers.customer_id, customers.name AS customer_name, customers.contact AS customer_contact, customers.address AS customer_address, customers.type AS customer_type ,projects.name AS project_name, projects.contact AS project_contact, projects.project_id FROM customers LEFT JOIN projects ON customers.customer_id = projects.customer_id`;
  const results = await pool.query(query);
  return results.rows;
}

//delete customer by id
async function deleteCustomerById(customerId) {
  const query = 'DELETE FROM customers WHERE customer_id=$1';
  await pool.query(query, [customerId]);
}

//get customer type
async function getCustomerTypes() {
  const query = 'SELECT * FROM customer_type';
  const results = await pool.query(query);
  return results.rows;
}
//add customer type
async function addCustomerType(name) {
  const query = 'INSERT INTO customer_type (customer_type_name) VALUES ($1)';
  const values = [name];
  await pool.query(query, values);
}
//delete  customer type
async function deleteCustomerTypeById(customerTypeId) {
  const query = 'DELETE FROM customer_type WHERE customer_type_id = $1';
  const values = [customerTypeId];
  await pool.query(query, values);
}
//update  customer type
async function updateCustomerTypeById(customerTypeId, name) {
  const query =
    'UPDATE customer_type SET customer_type_name = $1 WHERE customer_type_id = $2';
  const values = [name, customerTypeId];
  await pool.query(query, values);
}
//get customer id , name
async function getCustomerMenuList() {
  const query = 'SELECT name, customer_id FROM customers';
  const results = await pool.query(query);
  return results.rows;
}
// get project id, name
async function getProjectMenuList() {
  const query = 'SELECT name, project_id FROM projects';
  const results = await pool.query(query);
  return results.rows;
}
// get project by customer id
async function getProjectsByCustomerId(customerId) {
  const query = 'SELECT name, project_id FROM projects WHERE customer_id = $1';
  const result = await pool.query(query, [customerId]);
  return result.rows;
}

module.exports = {
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
};
