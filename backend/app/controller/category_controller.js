const { error } = require('console');
const Category = require('../models/category_module');
const Product = require('../models/product');
const SubCategory = require('../models/sub_category_module');
const fs = require('fs');
const path = require('path')
const category_controller = {}

// Create a new category
category_controller.create = async (req, res) => {
    try {
        const { body, file, user } = req
        if (!body.category || !body.sequence) {
            if (file) {
                // Remove the file if data validation fails
                fs.unlinkSync(path.join(__dirname, '../../uploads/', file.filename));
            }
            return res.status(400).json({ error: 'Category and sequence are required' });
        }
        // Check if category already exists
        const existingCategory = await Category.find({ category: body.category });
        if (existingCategory.length > 0) {
            return res.status(409).json({ error: `${body.category} already exists` });
        }
        // Create a new category instance
        const newCategory = new Category({
            category: body.category,
            categorySequence: body.sequence,
            userId: user.id,
            image: file ? file.path : null
        })

        // Save the new category to the database
        const savedCategory = await newCategory.save()
        res.status(201).json(savedCategory)
    } catch (error) {
        console.error('Error creating category:', error)
        res.status(500).json({ error: 'Failed to create category' })
    }
}

// Get all categories
category_controller.getAll = async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.user.id, isDeleted: false })
        res.status(200).json(categories)
    } catch (error) {
        console.error('Error fetching categories:', error)
        res.status(500).json({ error: 'Failed to fetch categories' })
    }
}

// Get a single category by ID
category_controller.getById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        if (!category) {
            return res.status(404).json({ error: 'Category not found' })
        }
        res.status(200).json(category)
    } catch (error) {
        console.error('Error fetching category:', error)
        res.status(500).json({ error: 'Failed to fetch category' })
    }
}

// Update a category
category_controller.update = async (req, res) => {
    try {
        console.log(req.body);

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            {
                category: req.body.category,
                categorySequence: req.body.categorySequence,
                image: req.file ? req.file.path : undefined,
                status: req.body.status
            },
            { new: true }
        )

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' })
        }

        res.status(200).json(updatedCategory)
    } catch (error) {
        console.error('Error updating category:', error)
        res.status(500).json({ error: 'Failed to update category' })
    }
}

// Soft delete a category and related products and subcategories
category_controller.delete = async (req, res) => {
    try {
        // Create an array of promises for deletion
        const promises = [
            Category.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true }),
            Product.updateMany({ categoryId: req.params.id }, { isDeleted: true }),
            SubCategory.updateMany({ categoryId: req.params.id }, { isDeleted: true })
        ];

        // Wait for all promises to complete
        const [deletedCategory, deletedProductsResult, deletedSubCategoriesResult] = await Promise.all(promises);

        // Check if the category was found and updated
        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Prepare response with counts of modified documents
        const deletedProductsCount = deletedProductsResult.nModified;
        const deletedSubCategoriesCount = deletedSubCategoriesResult.nModified;

        res.status(200).json({
            message: 'Category and related items processed successfully',
            deletedCategory: 'Category updated',
            deletedProducts: deletedProductsCount,
            deletedSubCategories: deletedSubCategoriesCount
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
}
module.exports = category_controller
