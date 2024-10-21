const mongoose = require('mongoose');
const courseDetailsSchema = new mongoose.Schema({
    courseTitle: {
        type: String,
    },
    topics: [
        {
            topic: { type: String },
            //topic2: { type: String }

        }
    ],
    assignments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment'
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

});

const CourseDetails = mongoose.model('CourseDetails', courseDetailsSchema);
module.exports = CourseDetails;