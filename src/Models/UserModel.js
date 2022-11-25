


const mongoose =  require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    }, 
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    personalList:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:'book',
       default:[]
    }]
},{timestamps:true})

module.exports = mongoose.model("user",userSchema)