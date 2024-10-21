const Course = require('../models/course'); 
const Submission = require('../models/submission');


const getAssignmentCounts = async (userId, courseId) => {
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({message:"Course Not found"});
        }
        
        const submissions = await Submission.find({ user: userId, course: courseId });
        const totalCount = course.courseDetails.length;
        const completedCount = submissions.filter(submission => submission.adminApproval === 'Completed').length;
        const pendingCount = submissions.filter(submission => submission.adminApproval === 'Pending').length;

        return { pendingCount, completedCount, totalCount };
    } catch (error) {
        return res.status(500).json({error:"Server Error"})
    }
};

module.exports=getAssignmentCounts