const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubCategorySchema = mongoose.Schema({
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    subCategory: {
        type: String,
        required: true
    },
    subCategorySequence: {
        type: Number,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
     status:{
        type:Boolean,
        default:true
    },
    image: String,
    isDeleted:{
        type:Boolean,
        default:false
    }
})

const SubCategory = mongoose.model('SubCategory', SubCategorySchema)

module.exports = SubCategory