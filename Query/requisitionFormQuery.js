const pool = require('./../config/db');

//requisition master data
const insertMasterData = async (
  // requisition_master_id,
  requisition_id,
  req_name,
  customer_id,
  project_id,
  supplier_id,
  total_amount,
  requisition_type
) => {
  const query =
    'INSERT INTO requisition_master_data (requisition_id, req_name, customer_id, project_id, supplier_id, total_amount, requisition_type_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING requisition_master_id';
  const values = [
    // requisition_master_id,
    requisition_id,
    req_name,
    customer_id,
    project_id,
    supplier_id,
    total_amount,
    requisition_type,
  ];
  const { rows } = await pool.query(query, values);
  const requisition_master_id = rows[0].requisition_master_id;
  console.log(requisition_master_id);
  return requisition_master_id;
};

//requisition details data
const insertDetails = async (
  requisition_master_id,
  item_category_id,
  item_name,
  uom,
  qty,
  unit_price,
  amount
) => {
  const query =
    'INSERT INTO requisition_details_data (requisition_master_id, item_category_id, item_name, uom, qty, unit_price, amount) VALUES ($1, $2, $3, $4, $5, $6, $7)';
  await pool.query(query, [
    requisition_master_id,
    item_category_id,
    item_name,
    uom,
    qty,
    unit_price,
    amount,
  ]);
};

//status
const insertStatus = async (requisition_master_id, status_id, assigned_to) => {
  const query =
    'INSERT INTO requisition_status (requisition_master_id, status_id, assigned_to) VALUES ($1, $2, $3)';
  await pool.query(query, [requisition_master_id, status_id, assigned_to]);
};

//comments
const insertComment = async (
  requisition_master_id,
  user_id,
  req_id,
  comments
) => {
  const query =
    'INSERT INTO comments (requisition_master_id, user_id, req_id, comments) VALUES ($1, $2, $3, $4)';
  await pool.query(query, [requisition_master_id, user_id, req_id, comments]);
};

//fileUrl
const insertFileDetails = async (requisition_master_id, fileUrl) => {
  const query =
    'INSERT INTO requisition_file_details (requisition_master_id, file_url) VALUES ($1, $2)';
  const values = [requisition_master_id, fileUrl];
  await pool.query(query, values);
};

//get requisition type
const getRequisitionTypes = async () => {
  const query =
    'SELECT requisition_type_id, requisition_type_name FROM requisition_type';
  const results = await pool.query(query);
  return results.rows;
};

//getAllData
const getAllData = async () => {
  const getDataQuery = `
  SELECT DISTINCT
  master.requisition_master_id,
  master.requisition_type_id,
  master.project_id,
  master.requisition_id,
  master.req_name,
  master.supplier_id,
  master.total_amount,
  master.created_at,
  details.uom,
  details.unit_price,
  details.qty,
  details.amount,
  rs.status_id,
  rs.assigned_to, 
  comments.id AS comment_id,
  comments.user_id,
  comments.req_id,
  comments.comments,
  files.file_urls,
  customers.name,
  vendor.vendor_name,
  status.status_name,
  category.category_name,
  products.name AS product_name,
  requisition_type.requisition_type_name
FROM requisition_master_data AS master
LEFT JOIN requisition_details_data AS details
  ON master.requisition_master_id = details.requisition_master_id
LEFT JOIN requisition_status AS rs 
  ON master.requisition_master_id = rs.requisition_master_id
LEFT JOIN comments
  ON master.requisition_master_id = comments.requisition_master_id
LEFT JOIN (
  SELECT requisition_master_id, STRING_AGG(file_url, ', ') AS file_urls
  FROM requisition_file_details
  GROUP BY requisition_master_id
) AS files
  ON master.requisition_master_id = files.requisition_master_id
LEFT JOIN customers
  ON master.customer_id = customers.customer_id
LEFT JOIN vendor
  ON master.supplier_id = vendor.vendor_id
LEFT JOIN status
  ON rs.status_id = status.status_id
LEFT JOIN category
  ON details.item_category_id = category.category_id
LEFT JOIN products
  ON details.item_name = products.id
LEFT JOIN requisition_type
  ON master.requisition_type_id = requisition_type.requisition_type_id;
;

  `;

  const result = await pool.query(getDataQuery);
  const rows = result.rows;
  const data = [];
  console.log('rows', rows);

  rows.forEach((row) => {
    const existingData = data.find(
      (item) => item.requisition_master_id === row.requisition_master_id
    );

    if (existingData) {
      if (
        !existingData.comments.find(
          (c) => c.comment === row.comments && c.comment_id === row.comment_id
        )
      ) {
        existingData.comments.push({
          comment_id: row.comment_id,
          comment: row.comments,
        });
      }
      if (row.file_urls) {
        const fileUrls = row.file_urls.split(',').map((url) => url.trim());
        fileUrls.forEach((url) => {
          if (!existingData.file_urls.find((file) => file.url === url)) {
            existingData.file_urls.push({ url });
          }
        });
      }
    } else {
      const newData = {
        requisition_master_id: row.requisition_master_id,
        requisition_type_id: row.requisition_type_id,
        requisition_type_name: row.requisition_type_name,
        project_id: row.project_id,
        requisition_id: row.requisition_id,
        req_name: row.req_name,
        supplier_id: row.supplier_id,
        total_amount: row.total_amount,
        created_at: row.created_at,
        status_id: row.status_id,
        assigned_to: row.assigned_to,
        comments: [],
        file_urls: [],
        name: row.name,
        vendor_name: row.vendor_name,
        status_name: row.status_name,
        descriptions: [],
      };

      if (row.comments) {
        newData.comments.push({
          comment_id: row.comment_id,
          comment: row.comments,
        });
      }

      if (row.file_urls) {
        const fileUrls = row.file_urls.split(',').map((url) => url.trim());
        fileUrls.forEach((url) => {
          if (!newData.file_urls.find((file) => file.url === url)) {
            newData.file_urls.push({ url });
          }
        });
      }

      data.push(newData);
    }

    const currentItem = data.find(
      (item) => item.requisition_master_id === row.requisition_master_id
    );
    currentItem.descriptions.push({
      category_name: row.category_name,
      product_name: row.product_name,
      qty: row.qty,
      uom: row.uom,
      unit_price: row.unit_price,
      amount: row.amount,
    });
  });

  return data;
};

//get sigle data based on requisition id
const getSingleData = async (requisitionId) => {
  const getDataQuery = `
    SELECT DISTINCT
      master.requisition_master_id,
      master.requisition_type_id,
      master.project_id,
      master.requisition_id,
      master.req_name,
      master.supplier_id,
      master.total_amount,
      master.created_at,
      details.uom,
      details.unit_price,
      details.qty,
      details.amount,
      rs.status_id,
      rs.assigned_to, 
      comments.id AS comment_id,
      comments.user_id,
      comments.req_id,
      comments.comments,
      files.file_urls,
      customers.name,
      vendor.vendor_name,
      status.status_name,
      category.category_name,
      products.name AS product_name,
      requisition_type.requisition_type_name
    FROM requisition_master_data AS master
    LEFT JOIN requisition_details_data AS details
      ON master.requisition_master_id = details.requisition_master_id
    LEFT JOIN requisition_status AS rs 
      ON master.requisition_master_id = rs.requisition_master_id
    LEFT JOIN comments
      ON master.requisition_master_id = comments.requisition_master_id
    LEFT JOIN (
      SELECT requisition_master_id, STRING_AGG(file_url, ', ') AS file_urls
      FROM requisition_file_details
      GROUP BY requisition_master_id
    ) AS files
      ON master.requisition_master_id = files.requisition_master_id
    LEFT JOIN customers
      ON master.customer_id = customers.customer_id
    LEFT JOIN vendor
      ON master.supplier_id = vendor.vendor_id
    LEFT JOIN status
      ON rs.status_id = status.status_id
    LEFT JOIN category
      ON details.item_category_id = category.category_id
    LEFT JOIN products
      ON details.item_name = products.id
    LEFT JOIN requisition_type
      ON master.requisition_type_id = requisition_type.requisition_type_id
    WHERE master.requisition_id = $1
  `;

  const result = await pool.query(getDataQuery, [requisitionId]);
  const rows = result.rows;
  const data = [];
  console.log('rows', rows);

  rows.forEach((row) => {
    const existingData = data.find(
      (item) => item.requisition_master_id === row.requisition_master_id
    );

    if (existingData) {
      if (
        !existingData.comments.find(
          (c) => c.comment === row.comments && c.comment_id === row.comment_id
        )
      ) {
        existingData.comments.push({
          comment_id: row.comment_id,
          comment: row.comments,
        });
      }
      if (row.file_urls) {
        const fileUrls = row.file_urls.split(',').map((url) => url.trim());
        fileUrls.forEach((url) => {
          if (!existingData.file_urls.find((file) => file.url === url)) {
            existingData.file_urls.push({ url });
          }
        });
      }
    } else {
      const newData = {
        requisition_master_id: row.requisition_master_id,
        requisition_type_id: row.requisition_type_id,
        requisition_type_name: row.requisition_type_name,
        project_id: row.project_id,
        requisition_id: row.requisition_id,
        req_name: row.req_name,
        supplier_id: row.supplier_id,
        total_amount: row.total_amount,
        created_at: row.created_at,
        status_id: row.status_id,
        assigned_to: row.assigned_to,
        comments: [],
        file_urls: [],
        name: row.name,
        vendor_name: row.vendor_name,
        status_name: row.status_name,
        descriptions: [],
      };

      if (row.comments) {
        newData.comments.push({
          comment_id: row.comment_id,
          comment: row.comments,
        });
      }

      if (row.file_urls) {
        const fileUrls = row.file_urls.split(',').map((url) => url.trim());
        fileUrls.forEach((url) => {
          if (!newData.file_urls.find((file) => file.url === url)) {
            newData.file_urls.push({ url });
          }
        });
      }

      data.push(newData);
    }

    const currentItem = data.find(
      (item) => item.requisition_master_id === row.requisition_master_id
    );
    currentItem.descriptions.push({
      category_name: row.category_name,
      product_name: row.product_name,
      qty: row.qty,
      uom: row.uom,
      unit_price: row.unit_price,
      amount: row.amount,
    });
  });

  return data;
};
module.exports = {
  insertMasterData,
  insertDetails,
  insertStatus,
  insertComment,
  insertFileDetails,
  getRequisitionTypes,
  getAllData,
  getSingleData,
};
