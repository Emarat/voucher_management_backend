const pool = require('./../config/db');

//post route
const addCategory = async (category_name, status, category_description) => {
  try {
    const existingCategory = await pool.query(
      'SELECT * FROM category WHERE category_name = $1',
      [category_name]
    );
    if (existingCategory.rows.length > 0) {
      return { success: false, message: 'Category already exists!' };
    }

    const query =
      'INSERT INTO category (category_name, status, category_description) VALUES ($1, $2, $3)';
    await pool.query(query, [category_name, status, category_description]);

    return { success: true, message: 'Category added successfully!' };
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Error adding category' };
  }
};

//get all categories
const getAllCategories = async () => {
  try {
    const query = 'SELECT * FROM category';
    const results = await pool.query(query);
    return results.rows;
  } catch (err) {
    console.error(err);
    return [];
  }
};

//get products by using category_id
const getCategoryById = async (categoryId) => {
  try {
    const query = 'SELECT * FROM category WHERE category_id = $1';
    const results = await pool.query(query, [categoryId]);
    return results.rows;
  } catch (err) {
    console.error(err);
    return [];
  }
};

//update category
const updateCategory = async (
  categoryId,
  category_name,
  category_description,
  status
) => {
  try {
    const query =
      'UPDATE category SET category_name=$1, category_description=$2, status=$3 WHERE category_id=$4';
    await pool.query(query, [
      category_name,
      category_description,
      status,
      categoryId,
    ]);

    return { success: true, message: 'Category updated successfully!' };
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Error updating category' };
  }
};

//delete category by id
const deleteCategory = async (categoryId) => {
  try {
    const query = 'DELETE FROM category WHERE category_id=$1';
    await pool.query(query, [categoryId]);

    return { success: true, message: 'Category deleted successfully!' };
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Error deleting category' };
  }
};

//delete multiple categories by id
const deleteMultipleCategories = async (categoryIds) => {
  if (!Array.isArray(categoryIds)) {
    return { success: false, message: 'Invalid request' };
  }

  try {
    let deletedCount = 0;
    for (const id of categoryIds) {
      const result = await pool.query(
        'DELETE FROM category WHERE category_id = $1',
        [id]
      );

      if (result.rowCount >= 1) {
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      return { success: true, message: 'Categories deleted successfully!' };
    } else {
      return { success: false, message: 'Categories not found' };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Server error' };
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  deleteMultipleCategories,
};
