const pool = require('./../config/db');

// Add product
const addProduct = async (name, category_id, status) => {
  try {
    const checkQuery =
      'SELECT * FROM products WHERE name=$1 AND category_id=$2 AND status=$3';
    const checkResult = await pool.query(checkQuery, [
      name,
      category_id,
      status,
    ]);

    if (checkResult.rowCount > 0) {
      throw new Error('Product already exists!');
    } else {
      const insertQuery =
        'INSERT INTO products (name, category_id, status) VALUES ($1, $2, $3)';
      await pool.query(insertQuery, [name, category_id, status]);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get all products
const getAllProducts = async () => {
  try {
    const query =
      'SELECT products.*,  category_name FROM products LEFT JOIN category ON products.category_id = category.category_id';
    const results = await pool.query(query);
    return results.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Delete all products
const deleteAllProducts = async () => {
  try {
    const result = await pool.query('DELETE FROM products');
    if (result.rowCount > 0) {
      return 'Delete All Products Successfully';
    } else {
      throw new Error('No products found');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get products by category_id
const getProductsByCategory = async (categoryId) => {
  try {
    const query = 'SELECT * FROM products WHERE category_id = $1';
    const results = await pool.query(query, [categoryId]);
    return results.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Delete product by id
const deleteProductById = async (productId) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1', [
      productId,
    ]);
    if (result.rowCount >= 1) {
      return 'Delete Product Successfully';
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Delete multiple products by id
const deleteMultipleProducts = async (productIds) => {
  try {
    let deletedCount = 0;
    for (const id of productIds) {
      const result = await pool.query('DELETE FROM products WHERE id = $1', [
        id,
      ]);
      if (result.rowCount >= 1) {
        deletedCount++;
      }
    }
    if (deletedCount > 0) {
      return 'Successfully Deleted!';
    } else {
      throw new Error('Products not found');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Update product
const updateProduct = async (productId, name, category_id, status) => {
  try {
    const query =
      'UPDATE products SET name=$1, category_id=$2, status=$3 WHERE id=$4';
    await pool.query(query, [name, category_id, status, productId]);
    return 'Product Updated successfully!';
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  deleteAllProducts,
  getProductsByCategory,
  deleteProductById,
  deleteMultipleProducts,
  updateProduct,
};
