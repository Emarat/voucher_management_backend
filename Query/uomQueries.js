const pool = require('./../config/db');

const getAllUOMs = async () => {
  try {
    const query = 'SELECT * FROM uom';
    const results = await pool.query(query);
    return results.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getAllUOMs,
};
