const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    subCategoryId: {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: String,
    isDeleted: {
        type: Boolean,
        default: false
    }
})

const Product = mongoose.model("Product", ProductSchema)

module.exports = Product