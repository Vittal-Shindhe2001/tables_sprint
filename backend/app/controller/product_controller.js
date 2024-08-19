const Product = require('../models/product')
const fs=require('fs')
const path=require('path')
const product_controller = {}

// Create a new product
product_controller.create = async (req, res) => {
    try {
        const { body, file, user } = req
        if (!body.subcategory || !body.category) {
            if (file) {
                // Remove the file if data validation fails
                fs.unlinkSync(path.join(__dirname, '../../uploads/', file.filename));
            }
            return res.status(400).json({ error: 'Category and subcategory are required' });
        }
        const existingProduct = await Product.find({ productName: body.productName });
        if (existingProduct.length > 0) {
            return res.status(409).json({ error: `${body.productName} already exists` });
        }
        // Create a new product instance
        const newProduct = new Product({
            productName: body.productName,
            categoryId: body.category,
            subCategoryId: body.subcategory,
            userId: user.id, 
            image: file ? file.path : null
        })

        // Save the new product to the database
        const savedProduct = await newProduct.save()
        res.status(201).json(savedProduct)
    } catch (error) {
        console.error('Error creating product:', error)
        res.status(500).json({ error: 'Failed to create product' })
    }
}

// Get all products
product_controller.getAll = async (req, res) => {
    try {
        const products = await Product.find({userId:req.user.id,isDeleted:false})
        res.status(200).json(products)
    } catch (error) {
        console.error('Error fetching products:', error)
        res.status(500).json({ error: 'Failed to fetch products' })
    }
}

// Get a single product by ID
product_controller.getById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('categoryId subCategoryId userId')
        if (!product) {
            return res.status(404).json({ error: 'Product not found' })
        }
        res.status(200).json(product)
    } catch (error) {
        console.error('Error fetching product:', error)
        res.status(500).json({ error: 'Failed to fetch product' })
    }
}

// Update a product
product_controller.update = async (req, res) => {
    try {
        (req.body);
        
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                productName: req.body.productName,
                categoryId: req.body.category,
                subCategoryId: req.body.subcategory,
                status: req.body.status,
                image: req.file ? req.file.path : undefined
            },
            { new: true } // Return the updated document
        )

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' })
        }

        res.status(200).json(updatedProduct)
    } catch (error) {
        console.error('Error updating product:', error)
        res.status(500).json({ error: 'Failed to update product' })
    }
}

// Delete a product
product_controller.delete = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndUpdate(req.params.id,{isDeleted:true},{new:true})
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' })
        }
        res.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
        console.error('Error deleting product:', error)
        res.status(500).json({ error: 'Failed to delete product' })
    }
} 

module.exports = product_controller 
