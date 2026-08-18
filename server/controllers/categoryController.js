/**
 * Category Controller
 * Retrieves and manages event categories
 */

const Category = require('../models/Category');
const { initialCategories } = require('../utils/seedData');

let memoryCategories = [...initialCategories];

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    try {
      let categories = await Category.find({});
      if (categories.length === 0) {
        categories = await Category.insertMany(initialCategories);
      }
      return res.json(categories);
    } catch (dbErr) {
      return res.json(memoryCategories);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// @desc    Create new category (Admin)
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    try {
      const category = await Category.create({ name, icon: icon || '🏷️', description: description || '' });
      return res.status(201).json(category);
    } catch (dbErr) {
      const newCat = {
        _id: 'cat_' + Date.now(),
        name,
        icon: icon || '🏷️',
        description: description || ''
      };
      memoryCategories.push(newCat);
      return res.status(201).json(newCat);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  memoryCategories
};
