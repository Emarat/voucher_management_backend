const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('./../config/db');


// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());




//requisition master data
router.post('/reqMasterData', async (req, res) => {
    try {
        const { requisition_id, name, customer_id, project_id, supplier_id, total_amount } = req.body;

        // Inserting data into PostgreSQL database
        const query =
            'INSERT INTO requisition_master_data (requisition_id, name, customer_id, project_id, supplier_id, total_amount) VALUES ($1, $2, $3, $4, $5, $6 )';
        await pool.query(query, [requisition_id, name, customer_id, project_id, supplier_id, total_amount]);

        res.status(201).send('Master Data Submitted!');
        console.log(object);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

//requisition details data
router.post('/detailsData', async (req, res) => {
    try {
        const { requisition_details_id, requisition_master_id, item_category_id, item_name, uom, qty, unit_price } = req.body;

        // Inserting data into PostgreSQL database
        const query =
            'INSERT INTO requisition_details_data (requisition_details_id, requisition_master_id, item_category_id, item_name, uom, qty, unit_price) VALUES ($1, $2, $3, $4, $5, $6, $7 )';
        await pool.query(query, [requisition_details_id, requisition_master_id, item_category_id, item_name, uom, qty, unit_price]);

        res.status(201).send('Details Data Submitted!');
        console.log(object);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

//requisition_file_details
router.post('/fileDetails', async (req, res) => {
    try {
        const { requisition_file_id, requisition_master_id, file_url } = req.body;

        // Inserting data into PostgreSQL database
        const query =
            'INSERT INTO requisition_file_details (requisition_file_id, requisition_master_id, file_url) VALUES ($1, $2, $3 )';
        await pool.query(query, [requisition_file_id, requisition_master_id, file_url]);

        res.status(201).send('File Details  Submitted!');
        console.log(object);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

//requisition_history
router.post('/reqHistory', async (req, res) => {
    try {
        const { history_id, requisition_master_id, action_done_by, action_status_id, comments } = req.body;

        // Inserting data into PostgreSQL database
        const query =
            'INSERT INTO requisition_history (history_id, requisition_master_id, action_done_by, action_status_id, comments) VALUES ($1, $2, $3, $4, $5 )';
        await pool.query(query, [history_id, requisition_master_id, action_done_by, action_status_id, comments]);

        res.status(201).send('Requisition History!');
        console.log(object);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

//requisition_status
router.post('/reqStatus', async (req, res) => {
    try {
        const { requisition_status_id, requisition_master_id, status_id, assigned_to, comments } = req.body;

        // Inserting data into PostgreSQL database
        const query =
            'INSERT INTO requisition_status (requisition_status_id, requisition_master_id, status_id, assigned_to, comments) VALUES ($1, $2, $3, $4, $5 )';
        await pool.query(query, [requisition_status_id, requisition_master_id, status_id, assigned_to, comments]);

        res.status(201).send('Requisition History!');
        console.log(object);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});


//status
router.post('/status', async (req, res) => {
    try {
        const { status_id, description } = req.body;

        // Inserting data into PostgreSQL database
        const query =
            'INSERT INTO status (status_id, description) VALUES ($1, $2)';
        await pool.query(query, [status_id, description]);

        res.status(201).send('Requisition Status!');
        console.log(object);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});



router.get('/allData', async (req, res) => {
    try {
        // Query to retrieve all requisition data
        const query = `SELECT * FROM
                        requisition_master_data,
                        requisition_details_data,
                        requisition_file_details,
                        requisition_history,
                        requisition_status
                       WHERE 
                        requisition_master_data.requisition_id = requisition_details_data.requisition_master_id AND
                        requisition_master_data.requisition_id = requisition_file_details.requisition_master_id AND
                        requisition_master_data.requisition_id = requisition_history.requisition_master_id AND
                        requisition_master_data.requisition_id = requisition_status.requisition_master_id`;

        const result = await pool.query(query);
        res.send(result.rows); // Send the data as a response
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});


module.exports = router;

