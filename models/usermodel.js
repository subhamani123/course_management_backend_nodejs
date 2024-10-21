const mongoose = require('mongoose');
const Student = require('../models/studentmodel');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type: String,
        default: "student",
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;

