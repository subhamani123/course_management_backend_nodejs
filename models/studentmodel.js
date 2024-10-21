const mongoose = require('mongoose');
const User = require('./usermodel');

const studentSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    mobile:{
        type:Number,
        unique:true
    },
    college:{
        type:String,
    },
    department:{
        type:String,
    },
    userDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    completedCourses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }]
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
