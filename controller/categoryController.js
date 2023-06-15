const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
// const pool = require('./../config/db');
const {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  deleteMultipleCategories,
} = require('../Query/categoryQueries');

// Set up middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//post route
router
  .route('/category')
  .post(async (req, res) => {
    const { category_name, status, category_description } = req.body;
    const result = await addCategory(
      category_name,
      status,
      category_description
    );

    if (result.success) {
      res.status(201).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  })
  .get(async (req, res) => {
    const categories = await getAllCategories();
    res.json(categories);
  });

//get products by using category_id
router.get('/category/:id', async (req, res) => {
  const categoryId = req.params.id;
  const categories = await getCategoryById(categoryId);
  res.json(categories);
});

//update category
router.patch('/category/:id', async (req, res) => {
  const categoryId = req.params.id;
  const { category_name, category_description, status } = req.body;
  const result = await updateCategory(
    categoryId,
    category_name,
    category_description,
    status
  );

  if (result.success) {
    res.status(200).send(result.message);
  } else {
    res.status(400).send(result.message);
  }
});

//delete category by id
router.delete('/category/:id', async (req, res) => {
  const categoryId = req.params.id;
  const result = await deleteCategory(categoryId);

  if (result.success) {
    res.status(200).send(result.message);
  } else {
    res.status(400).send(result.message);
  }
});

//delete multiple categories by id
router.delete('/categories', async (req, res) => {
  const categoryIds = req.body.ids;
  const result = await deleteMultipleCategories(categoryIds);

  if (result.success) {
    res.status(200).send(result.message);
  } else {
    res.status(400).send(result.message);
  }
});

module.exports = router;
