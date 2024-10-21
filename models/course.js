const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    courseManager:{
        type:String,
    },
    managerMail:{
        type:String,
    },
    courseDetails:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CourseDetails'
    }],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    completedStudents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    }]

});

const Course = mongoose.model('Course',courseSchema);
module.exports= Course;