const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"title field can not be empty"],
        unique: [true,"title exist,title must be Unique"],
        trim:true
    },
      ISBN: {
        type: String,
        required: true,
        unique: [true,"ISBN exist,ISBN must be Unique"],
        trim: true,
        min:[10,"ISBN No should be greater than 10"],
        max:[13,"ISBN No can not exceed 13 character"]
      },
      image:{
            type:String,
            trim:true,
            default:null
      },
      deletedAt: {
        type: Date,
        default: null
      },

},{timestamps:true})

module.exports = mongoose.model("book", bookSchema);