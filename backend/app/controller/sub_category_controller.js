const SubCategory = require('../models/sub_category_module')

const sub_category_controller = {}

// Create a new subcategory
sub_category_controller.create = async (req, res) => {
    try {
        const { body, file, user } = req
        if (!body.subCategory || !body.sequence || !body.category) {
            if (file) {
                // Remove the file if data validation fails
                fs.unlinkSync(path.join(__dirname, '../../uploads/', file.filename))
            }
            return res.status(400).json({ error: 'subCategory and sequence are required' })
        }
        const existingSubCategory = await SubCategory.find({ subCategory: body.subCategory });
        if (existingSubCategory.length > 0) {
            return res.status(409).json({ error: `${body.subCategory} already exists` });
        }
        // Create a new subcategory instance
        const newSubCategory = new SubCategory({
            categoryId: body.category,
            subCategory: body.subCategory,
            subCategorySequence: body.sequence,
            userId: user.id,
            image: file ? file.path : null
        })

        // Save the new subcategory to the database
        const savedSubCategory = await newSubCategory.save()
        res.status(201).json(savedSubCategory)
    } catch (error) {
        res.status(500).json({ error: 'Failed to create subcategory' })
    }
}

// Get all subcategories
sub_category_controller.getAll = async (req, res) => {
    try {
        const subCategories = await SubCategory.find({userId:req.user.id,isDeleted:false}).populate('categoryId')
        res.status(200).json(subCategories)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch subcategories' })
    }
}

// Get a single subcategory by ID
sub_category_controller.getById = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id).populate('categoryId')
        if (!subCategory) {
            return res.status(404).json({ error: 'SubCategory not found' })
        }
        res.status(200).json(subCategory)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch subcategory' })
    }
}

// Update a subcategory
sub_category_controller.update = async (req, res) => {
    try {    
        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            req.params.id,
            {
                category: req.body.category,
                subCategory: req.body.subCategory,
                subCategorySequence: req.body.subCategorySequence,
                image: req.file ? req.file.path : undefined,
                status:req.body.status
            },
            { new: true }, { runValidation: true }
        )

        if (!updatedSubCategory) {
            return res.status(404).json({ error: 'SubCategory not found' })
        }

        res.status(200).json(updatedSubCategory)
    } catch (error) {
        res.status(500).json({ error: 'Failed to update subcategory' })
    }
}

// Delete a subcategory
sub_category_controller.delete = async (req, res) => {
    try {
        const subCategoryId = req.params.id;

        // Create an array of promises
        const promises = [
            // Soft delete the subcategory
            SubCategory.findByIdAndUpdate(subCategoryId, { isDeleted: true }, { new: true }),

            // Soft delete related products
            Product.updateMany({ subCategoryId: subCategoryId }, { isDeleted: true })
        ]
        const [deletedSubCategory, deletedProductsResult] = await Promise.allSettled(promises);

        // Check if the subcategory was found and updated
        if (!deletedSubCategory) {
            return res.status(404).json({ error: 'SubCategory not found' })
        }


        const deletedProductsCount = deletedProductsResult.nModified;

        res.status(200).json({
            message: 'SubCategory and related products deleted successfully',
            deletedProductsCount: deletedProductsCount
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete subcategory and related products' })
    }
}

module.exports = sub_category_controller
