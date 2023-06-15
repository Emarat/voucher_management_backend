const pool = require('./../config/db');

const addVendor = async (vendor) => {
  try {
    const { vendor_name, vendor_type, vendor_contact, vendor_number, status } =
      vendor;

    const selectQuery =
      'SELECT * FROM vendor WHERE vendor_name = $1 AND vendor_type = $2 AND vendor_contact = $3 AND vendor_number = $4';
    const result = await pool.query(selectQuery, [
      vendor_name,
      vendor_type,
      vendor_contact,
      vendor_number,
    ]);

    if (result.rows.length > 0) {
      throw new Error('Vendor already exists!');
    }

    const insertQuery =
      'INSERT INTO vendor (vendor_name, vendor_type, vendor_contact, vendor_number, status) VALUES ($1, $2, $3, $4, $5)';
    await pool.query(insertQuery, [
      vendor_name,
      vendor_type,
      vendor_contact,
      vendor_number,
      status,
    ]);

    return 'Vendor added successfully!';
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAllVendors = async () => {
  try {
    const query =
      'SELECT v.*, vt.vendor_type_name FROM vendor v INNER JOIN vendor_type vt ON v.vendor_type = vt.vendor_type_id';
    const results = await pool.query(query);
    return results.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateVendor = async (vendor) => {
  try {
    const {
      vendor_id,
      vendor_name,
      vendor_type,
      vendor_contact,
      vendor_number,
      status,
    } = vendor;

    const checkQuery = 'SELECT * FROM vendor WHERE vendor_id = $1';
    const { rows } = await pool.query(checkQuery, [vendor_id]);
    if (rows.length === 0) {
      throw new Error('Vendor not found');
    }

    const updateQuery =
      'UPDATE vendor SET vendor_name = $1, vendor_type = $2, vendor_contact = $3, vendor_number = $4, status=$5 WHERE vendor_id = $6';
    await pool.query(updateQuery, [
      vendor_name,
      vendor_type,
      vendor_contact,
      vendor_number,
      status,
      vendor_id,
    ]);

    return 'Vendor updated successfully!';
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteVendor = async (vendorId) => {
  try {
    const checkQuery = 'SELECT * FROM vendor WHERE vendor_id = $1';
    const { rows } = await pool.query(checkQuery, [vendorId]);
    if (rows.length === 0) {
      throw new Error('Vendor not found');
    }

    const deleteQuery = 'DELETE FROM vendor WHERE vendor_id = $1';
    await pool.query(deleteQuery, [vendorId]);

    return 'Vendor deleted successfully!';
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteMultipleVendors = async (vendorIds) => {
  try {
    let deletedCount = 0;
    for (const id of vendorIds) {
      const result = await pool.query(
        'DELETE FROM vendor WHERE vendor_id = $1',
        [id]
      );

      if (result.rowCount >= 1) {
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      return 'Successfully deleted!';
    } else {
      throw new Error('Vendors not found');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAllVendorTypes = async () => {
  try {
    const query = 'SELECT * FROM vendor_type';
    const results = await pool.query(query);
    return results.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  addVendor,
  getAllVendors,
  updateVendor,
  deleteVendor,
  deleteMultipleVendors,
  getAllVendorTypes,
};
