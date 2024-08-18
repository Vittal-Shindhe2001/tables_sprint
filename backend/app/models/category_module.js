const mongoose=require('mongoose')
const Schema = mongoose.Schema

const CategorySchema=mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    categorySequence:{
        type:Number,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:Boolean,
        default:true
    },
    image:String,
    isDeleted:{
        type:Boolean,
        default:false
    }
})

const Category=mongoose.model('Category',CategorySchema)

module.exports=Category