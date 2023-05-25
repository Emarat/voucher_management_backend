const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const router = express.Router();
const pool = require('./../config/db');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Set the destination folder for uploaded files

// Submit requisition data
router.post('/submitRequisition', upload.array('files'), async (req, res) => {
  try {
    const {
      requisition_master_id,
      req_name,
      customer_id,
      project_id,
      supplier_id,
      total_amount,
      requisition_type,
      details: requisitionDetails,
      status: requisitionStatus,
      comments,
    } = req.body;

    // Inserting data into requisition_master_data table
    const masterDataQuery =
      'INSERT INTO requisition_master_data (requisition_master_id, req_name, customer_id, project_id, supplier_id, total_amount, requisition_type) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    await pool.query(masterDataQuery, [
      requisition_master_id,
      req_name,
      customer_id,
      project_id,
      supplier_id,
      total_amount,
      requisition_type,
    ]);

    // Inserting data into requisition_details_data table
    if (requisitionDetails && requisitionDetails.length > 0) {
      const detailsQuery =
        'INSERT INTO requisition_details_data (requisition_master_id, item_category_id, item_name, uom, qty, unit_price) VALUES ($1, $2, $3, $4, $5, $6)';
      for (const details of requisitionDetails) {
        await pool.query(detailsQuery, [
          details.requisition_master_id,
          details.item_category_id,
          details.item_name,
          details.uom,
          details.qty,
          details.unit_price,
        ]);
      }
    }

    // Inserting data into requisition_file_details table
    if (req.files && req.files.length > 0) {
      const filesQuery =
        'INSERT INTO requisition_file_details (file_url, requisition_master_id) VALUES ($1, $2)';
      for (const file of req.files) {
        await pool.query(filesQuery, [file.path, requisition_master_id]);
      }
    }

    // Inserting data into requisition_status table
    if (requisitionStatus && requisitionStatus.length > 0) {
      const statusQuery =
        'INSERT INTO requisition_status (requisition_master_id, status_id, assigned_to) VALUES ($1, $2, $3)';
      for (const status of requisitionStatus) {
        await pool.query(statusQuery, [
          status.requisition_master_id,
          status.status_id,
          status.assigned_to,
        ]);
      }
    }

    // Inserting data into comments table
    if (comments && comments.length > 0) {
      const commentsQuery =
        'INSERT INTO comments (user_id, req_id, comments, requisition_master_id) VALUES ($1, $2, $3, $4)';
      for (const comment of comments) {
        await pool.query(commentsQuery, [
          comment.user_id,
          comment.req_id,
          comment.comments,
          comment.requisition_master_id,
        ]);
      }
    }

    res.status(201).send('Requisition Submitted!');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Retrieve all requisition data
router.get('/allData', async (req, res) => {
  try {
    // Query to retrieve all requisition data
    const query = `
            SELECT *
            FROM requisition_master_data
            INNER JOIN requisition_details_data ON requisition_master_data.requisition_id = requisition_details_data.requisition_master_id
            INNER JOIN requisition_file_details ON requisition_master_data.requisition_id = requisition_file_details.requisition_master_id
            INNER JOIN requisition_status ON requisition_master_data.requisition_id = requisition_status.requisition_master_id
            LEFT JOIN comments ON requisition_master_data.requisition_id = comments.req_id
        `;

    const result = await pool.query(query);
    res.send(result.rows); // Send the data as a response
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;

// const express = require('express');
// const bodyParser = require('body-parser');
// const router = express.Router();
// const pool = require('./../config/db');

// // Set up middleware
// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(bodyParser.json());

// //requisition master data
// router.post('/reqMasterData', async (req, res) => {
//     try {
//         const { requisition_id, name, customer_id, project_id, supplier_id, total_amount } = req.body;

//         // Inserting data into PostgreSQL database
//         const query =
//             'INSERT INTO requisition_master_data (requisition_id, name, customer_id, project_id, supplier_id, total_amount) VALUES ($1, $2, $3, $4, $5, $6 )';
//         await pool.query(query, [requisition_id, name, customer_id, project_id, supplier_id, total_amount]);

//         res.status(201).send('Master Data Submitted!');
//         console.log(object);
//     } catch (err) {
//         console.error(err);
//         res.sendStatus(500);
//     }
// });

// //requisition details data
// router.post('/detailsData', async (req, res) => {
//     try {
//         const { requisition_details_id, requisition_master_id, item_category_id, item_name, uom, qty, unit_price } = req.body;

//         // Inserting data into PostgreSQL database
//         const query =
//             'INSERT INTO requisition_details_data (requisition_details_id, requisition_master_id, item_category_id, item_name, uom, qty, unit_price) VALUES ($1, $2, $3, $4, $5, $6, $7 )';
//         await pool.query(query, [requisition_details_id, requisition_master_id, item_category_id, item_name, uom, qty, unit_price]);

//         res.status(201).send('Details Data Submitted!');
//         console.log(object);
//     } catch (err) {
//         console.error(err);
//         res.sendStatus(500);
//     }
// });

// //requisition_file_details
// router.post('/fileDetails', async (req, res) => {
//     try {
//         const { requisition_file_id, requisition_master_id, file_url } = req.body;

//         // Inserting data into PostgreSQL database
//         const query =
//             'INSERT INTO requisition_file_details (requisition_file_id, requisition_master_id, file_url) VALUES ($1, $2, $3 )';
//         await pool.query(query, [requisition_file_id, requisition_master_id, file_url]);

//         res.status(201).send('File Details  Submitted!');
//         console.log(object);
//     } catch (err) {
//         console.error(err);
//         res.sendStatus(500);
//     }
// });

// //requisition_history
// router.post('/reqHistory', async (req, res) => {
//     try {
//         const { history_id, requisition_master_id, action_done_by, action_status_id } = req.body;

//         // Inserting data into PostgreSQL database
//         const query =
//             'INSERT INTO requisition_history (history_id, requisition_master_id, action_done_by, action_status_id) VALUES ($1, $2, $3, $4)';
//         await pool.query(query, [history_id, requisition_master_id, action_done_by, action_status_id]);

//         res.status(201).send('Requisition History!');
//         console.log(object);
//     } catch (err) {
//         console.error(err);
//         res.sendStatus(500);
//     }
// });

// //requisition_status
// router.post('/reqStatus', async (req, res) => {
//     try {
//         const { requisition_status_id, requisition_master_id, status_id, assigned_to } = req.body;

//         // Inserting data into PostgreSQL database
//         const query =
//             'INSERT INTO requisition_status (requisition_status_id, requisition_master_id, status_id, assigned_to) VALUES ($1, $2, $3, $4)';
//         await pool.query(query, [requisition_status_id, requisition_master_id, status_id, assigned_to]);

//         res.status(201).send('Requisition History!');
//         console.log(object);
//     } catch (err) {
//         console.error(err);
//         res.sendStatus(500);
//     }
// });

// //status
// router.post('/status', async (req, res) => {
//     try {
//         const { status_id } = req.body;

//         // Inserting data into PostgreSQL database
//         const query =
//             'INSERT INTO status (status_id) VALUES ($1)';
//         await pool.query(query, [status_id]);

//         res.status(201).send('Requisition Status!');
//         console.log(object);
//     } catch (err) {
//         console.error(err);
//         res.sendStatus(500);
//     }
// });

// //post comments
// router.post('/comments', async (req, res) => {
//     try {
//         const { user_id, req_id, comments } = req.body;
//         const query = 'INSERT INTO comments (user_id, req_id, comments) VALUES ($1, $2, $3)';
//         await pool.query(query, [user_id, req_id, comments]);
//         res.status(201).send('Commments Submitted!');
//     } catch (err) {
//         console.log(err);
//         res.sendStatus(500);
//     }
// });

// router.get('/allData', async (req, res) => {
//     try {
//         // Query to retrieve all requisition data
//         const query = `
//         SELECT *
//         FROM requisition_master_data
//         INNER JOIN requisition_details_data ON requisition_master_data.requisition_id = requisition_details_data.requisition_master_id
//         INNER JOIN requisition_file_details ON requisition_master_data.requisition_id = requisition_file_details.requisition_master_id
//         INNER JOIN requisition_history ON requisition_master_data.requisition_id = requisition_history.requisition_master_id
//         INNER JOIN requisition_status ON requisition_master_data.requisition_id = requisition_status.requisition_master_id
//         LEFT JOIN comments ON requisition_master_data.requisition_id = comments.req_id
//       `;

//         const result = await pool.query(query);
//         res.send(result.rows); // Send the data as a response
//     } catch (err) {
//         console.error(err);
//         res.sendStatus(500);
//     }
// });

// module.exports = router;
