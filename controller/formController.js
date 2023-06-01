const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('./../config/db');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');

// Set up middleware
router.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 1000000,
  })
);
router.use(bodyParser.json({ limit: '50mb' }));
router.use(
  fileUpload({
    array: true,
  })
);

// Submit requisition data
router.post('/submitRequisition', async (req, res) => {
  try {
    const {
      requisition_id,
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
      'INSERT INTO requisition_master_data (requisition_id, req_name, customer_id, project_id, supplier_id, total_amount, requisition_type_id) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    await pool.query(masterDataQuery, [
      requisition_id, // Make sure requisition_id is retrieved correctly
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
        'INSERT INTO requisition_details_data (item_category_id, item_name, uom, qty, unit_price) VALUES ($1, $2, $3, $4, $5)';
      for (const details of requisitionDetails) {
        await pool.query(detailsQuery, [
          details.item_category_id,
          details.item_name,
          details.uom,
          details.qty,
          details.unit_price,
        ]);
      }
    }

    // Inserting data into requisition_status table
    if (requisitionStatus && requisitionStatus.length > 0) {
      const statusQuery =
        'INSERT INTO requisition_status ( status_id, assigned_to) VALUES ($1, $2)';
      for (const status of requisitionStatus) {
        await pool.query(statusQuery, [status.status_id, status.assigned_to]);
      }
    }

    // Inserting data into comments table
    if (comments && comments.length > 0) {
      const commentsQuery =
        'INSERT INTO comments (user_id, req_id, comments) VALUES ($1, $2, $3)';
      for (const comment of comments) {
        await pool.query(commentsQuery, [
          comment.user_id,
          comment.req_id,
          comment.comments,
        ]);
      }
    }

    res.status(201).send('Requisition Submitted!');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

//file upload
router.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // Get the uploaded files from the request
  const fileKeys = Object.keys(req.files);

  // Move each file to the designated folder
  const uploadPromises = fileKeys.map((fileKey) => {
    let files = req.files[fileKey];

    // Convert single file to an array with a single element
    if (!Array.isArray(files)) {
      files = [files];
    }

    // Check if the files are valid
    if (!files || !Array.isArray(files)) {
      return Promise.reject('Invalid files.');
    }

    // Move each file to the designated folder
    const fileUploadPromises = files.map((file) => {
      if (!file || !file.name) {
        return Promise.reject('Invalid file.');
      }

      const uniqueFileName = `${file.name}`;
      const uploadPath = `uploads/${uniqueFileName}`;

      return new Promise((resolve, reject) => {
        file.mv(uploadPath, (err) => {
          if (err) {
            console.error(err);
            reject('An error occurred while uploading the file.');
          } else {
            const fileUrl = `${process.env.BASE_URL}${uniqueFileName}`;
            const query =
              'INSERT INTO requisition_file_details (file_url) VALUES ($1)';
            const values = [fileUrl];

            pool
              .query(query, values)
              .then(() => {
                resolve('File uploaded and details stored successfully.');
              })
              .catch((err) => {
                console.error(err);
                reject('An error occurred while storing the file details.');
              });
          }
        });
      });
    });

    return Promise.all(fileUploadPromises);
  });

  Promise.all(uploadPromises)
    .then((results) => {
      res.send(results.flat().join('\n')); // Send success messages for all files
    })
    .catch((error) => {
      res.status(500).send(error); // Send the first encountered error message
    });
});

//requisitionType
router.get('/requisitionType', async (req, res) => {
  try {
    const query =
      'SELECT requisition_type_id, requisition_type_name FROM requisition_type';
    const results = await pool.query(query);
    res.json(results.rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Get all tables data
router.get('/getAllData', async (req, res) => {
  try {
    const getDataQuery = `
    SELECT *
    FROM requisition_master_data AS master
    LEFT JOIN requisition_details_data AS details ON master.requisition_master_id = details.requisition_master_id
    LEFT JOIN requisition_status AS status ON master.requisition_master_id = status.requisition_master_id
    LEFT JOIN comments ON master.requisition_master_id = comments.requisition_master_id
    LEFT JOIN requisition_file_details AS files ON master.requisition_master_id = files.requisition_master_id
  `;

    const result = await pool.query(getDataQuery);
    const data = result.rows;

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
