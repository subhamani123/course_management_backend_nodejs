const mongoose = require('mongoose');
const submissionSchema = new mongoose.Schema({
    assignmentLink:{
        type:String,
        required:true
    },
   
    assignment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Assignment'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    },
    course:{type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    studentSubmissionStatus:{
        type:Boolean,
        enum:['true','false'],
        default:'false'
    },
    adminApproval:{
        type:String,
        enum:["Pending","Completed","Redo"],
        default:"Pending"
    }

});

const Submission = mongoose.model('Submission',submissionSchema);
module.exports= Submission;