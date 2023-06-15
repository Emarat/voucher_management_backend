const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
// const pool = require('./../config/db');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const uniqueId = uuidv4();
const { getKeycloakInstance } = require('../config/keycloak-config');
const keycloak = getKeycloakInstance();
const {
  insertMasterData,
  insertDetails,
  insertStatus,
  insertComment,
  insertFileDetails,
  getRequisitionTypes,
  getAllData,
} = require('../Query/requisitionFormQuery');

let counter = 1;

// Set up middleware
//keycloak middleware
router.use(keycloak.middleware());

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
// Submit requisition data
router.post('/submitRequisition', async (req, res) => {
  try {
    const requisition_master_id = counter++;
    // console.log('master_data_id', requisition_master_id);
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
    await insertMasterData(
      requisition_master_id,
      requisition_id,
      req_name,
      customer_id,
      project_id,
      supplier_id,
      total_amount,
      requisition_type
    );

    // Inserting data into requisition_details_data table
    if (requisitionDetails && requisitionDetails.length > 0) {
      for (const details of requisitionDetails) {
        await insertDetails(
          requisition_master_id,
          details.item_category_id,
          details.item_name,
          details.uom,
          details.qty,
          details.unit_price,
          details.amount
        );
      }
    }

    // Inserting data into requisition_status table
    if (requisitionStatus && requisitionStatus.length > 0) {
      for (const status of requisitionStatus) {
        await insertStatus(
          requisition_master_id,
          status.status_id,
          status.assigned_to
        );
      }
    }

    // Inserting data into comments table
    if (comments && comments.length > 0) {
      for (const comment of comments) {
        await insertComment(
          requisition_master_id,
          comment.user_id,
          comment.req_id,
          comment.comments
        );
      }
    }

    res.status(201).send('Requisition Submitted!');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

let counters = 1;
//file upload
router.post('/upload', (req, res) => {
  const requisition_master_id = counters++;
  console.log('master_data_id', requisition_master_id);
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const fileKeys = Object.keys(req.files);

  const uploadPromises = fileKeys.map((fileKey) => {
    let files = req.files[fileKey];

    if (!Array.isArray(files)) {
      files = [files];
    }

    if (!files || !Array.isArray(files)) {
      return Promise.reject('Invalid files.');
    }

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
            insertFileDetails(requisition_master_id, fileUrl)
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
      res.send(results.flat().join('\n'));
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

//requisitionType
router.get('/requisitionType', async (req, res) => {
  try {
    const requisitionTypes = await getRequisitionTypes();
    res.json(requisitionTypes);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Get all tables data
// router.get('/getAllData', async (req, res) => {
//   try {
//     const getDataQuery = `
//     SELECT DISTINCT
//     master.requisition_master_id,
//     master.requisition_type_id,
//     master.project_id,
//     master.requisition_id,
//     master.req_name,
//     master.supplier_id,
//     master.total_amount,
//     master.created_at,
//     details.uom,
//     details.unit_price,
//     details.qty,
//     details.amount,
//     rs.status_id,
//     rs.assigned_to,
//     comments.user_id,
//     comments.req_id,
//     comments.comments,
//     files.file_url,
//     customers.name,
//     vendor.vendor_name,
//     status.status_name,
//     category.category_name,
//     products.name AS product_name
//   FROM
//     requisition_master_data AS master
//   LEFT JOIN
//     requisition_details_data AS details
//     ON master.requisition_master_id = details.requisition_master_id
//   LEFT JOIN
//     requisition_status AS rs
//     ON master.requisition_master_id = rs.requisition_master_id
//   LEFT JOIN
//     comments
//     ON master.requisition_master_id = comments.requisition_master_id
//   LEFT JOIN
//     requisition_file_details AS files
//     ON master.requisition_master_id = files.requisition_master_id
//   LEFT JOIN
//     customers
//     ON master.customer_id = customers.customer_id
//   LEFT JOIN
//     vendor
//     ON master.supplier_id = vendor.vendor_id
//   LEFT JOIN
//     status
//     ON rs.status_id = status.status_id
//   LEFT JOIN
//     category
//     ON details.item_category_id = category.category_id
//   LEFT JOIN
//     products
//     ON details.item_name = products.id;

//   `;

//     const result = await pool.query(getDataQuery);
//     const data = result.rows;

//     res.status(200).json(data);
//   } catch (err) {
//     console.error(err);
//     res.sendStatus(500);
//   }
// });

router.get('/getAllData', async (req, res) => {
  try {
    const data = await getAllData();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
