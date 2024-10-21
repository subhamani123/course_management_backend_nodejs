
const Student = require('../models/studentmodel')
const Course=require('../models/course')
const User = require('../models/usermodel'); // Assuming your user model is named 'usermodel'

// Update completed status
const completeStatus = async (req, res) => {
    const { courseid } = req.params;  // Get the course ID from the route parameters
    const studentId = req.user.id;    // Get the student ID from the authenticated user

    try {
        // Use the countAssignmentsMiddleware to get the counts
        if (!req.assignmentCounts){
            return res.status(400).json({message:"Count is not calculated"})
        }
        const { pendingCount, completedCount, totalCount } = req.assignmentCounts;

        // Check if all assignments are completed
        if (completedCount === totalCount && totalCount > 0) {
            // Find the student and course documents
            const student = await Student.findOne({userDetails:studentId});
            const course = await Course.findById(courseid);

            if (!student || !course) {
                return res.status(404).json({ message: 'Student or Course not found' });
            }

            // Ensure completedCourses is initialized as an array
            if (!Array.isArray(student.completedCourses)) {
                student.completedCourses = [];
            }

            // Ensure completedStudents is initialized as an array
            if (!Array.isArray(course.completedStudents)) {
                course.completedStudents = [];
            }

            // Update the student's completed courses if not already added
            if (!student.completedCourses.includes(courseid)) {
                student.completedCourses.push(courseid);
                await student.save();
            }
            else{
                return res.status(400).json({ message: 'Course already completed by the user' });
            }

            // Update the course's completed students if not already added
            if (!course.completedStudents.includes(studentId)) {
                course.completedStudents.push(studentId);
                await course.save();
            }
            else{
                return res.status(400).json({ message: 'Course already completed by the user' });
            }

            return res.status(200).json({ message: 'Course marked as completed for the student' });
        } else {
            return res.status(400).json({ message: 'Course is not yet fully completed' });
        }
    } catch (error) {
        console.error('Error updating course completion status:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};



module.exports = { completeStatus };
