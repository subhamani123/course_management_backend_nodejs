const CourseDetails = require('../models/coursedetail');
const Course = require('../models/course');
const User = require('../models/usermodel');
const Student = require('../models/studentmodel');
const Assignment = require('../models/assignment');

// Create a new course detail (Admin only)
const createCourseDetail = async (req, res) => {
    const { courseTitle, topics, assignments } = req.body;
    const {courseid} =req.params
    try {
        const existingcourse= await Course.findById(courseid)
        if(!existingcourse){
            return res.status(400).json({message:'No Course Found'})
        }

        //Create the assignment
        const newAssignment =new Assignment({
            tasks:assignments.tasks,
            link:assignments.link
        })
        await newAssignment.save()

        // Create the new course detail
        const newCourseDetail = new CourseDetails({
            courseTitle,
            topics,
            assignments:newAssignment._id,
            course:existingcourse._id,
            user: req.user.id, // Link the course detail to the admin user
        });

        const savedCourseDetail = await newCourseDetail.save();

        newAssignment.coursedetails = newCourseDetail._id
        await newAssignment.save() 

        existingcourse.courseDetails.push(newCourseDetail._id)
        await existingcourse.save()
        
        
        res.status(201).json({ message: 'Course detail created successfully', courseDetail: savedCourseDetail });
    } catch (error) {
        console.error('Error creating course detail:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all course details (Admin & Student)
const getAllCourseDetails = async (req, res) => {
    try {
        const courseDetails = await CourseDetails.find()
            .populate('assignments')
            .populate('course')
            .populate('user', 'email');

        res.status(200).json(courseDetails);
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a single coursedetail by ID (Admin & Student)
const getCourseDetailById = async (req, res) => {
    const { id } = req.params;

    try {
        const courseDetail = await CourseDetails.findById(id).select('courseTitle topics assignments')
            .populate('assignments')

        if (!courseDetail) {
            return res.status(404).json({ message: 'Course detail not found' });
        }

        res.status(200).json(courseDetail);
    } catch (error) {
        console.error('Error fetching course detail:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//Get a course details (modules) of one course by courseid
const getCourseDetailsByCourseId =async(req,res)=>{
    const { courseid } =req.params
    try{
        const courseDetail = await Course.findById(courseid).select('courseDetails').populate('courseDetails')
        if(!courseDetail ){
            return res.status(404).json({message:"Course or course details not found"})

        }
        
        const courseTitles=courseDetail.courseDetails.map(detail=>detail.courseTitle)
        
        
        res.status(200).json({message:'Course details retrieved Successfully',courseTitles})


    }
    catch(error){
        console.error("Error in fetching course details",error)
        res.status(500).json({ message: 'Server error' });
    }
}


// Update a course detail (Admin only)
const updateCourseDetail = async (req, res) => {
    const { id } = req.params;
    const { courseTitle, topics, assignments, course } = req.body;

    try {
        // Update the course detail
        const updatedCourseDetail = await CourseDetails.findByIdAndUpdate(
            id,
            { courseTitle, topics, assignments, course },
            { new: true }
        );

        if (!updatedCourseDetail) {
            return res.status(404).json({ message: 'Course detail not found' });
        }

        res.status(200).json({ message: 'Course detail updated successfully', courseDetail: updatedCourseDetail });
    } catch (error) {
        console.error('Error updating course detail:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a course detail (Admin only)
const deleteCourseDetail = async (req, res) => {
    const { id } = req.params;

    try {
       // Delete the course detail
        const deletedCourseDetail = await CourseDetails.findByIdAndDelete(id);

        if (!deletedCourseDetail) {
            return res.status(404).json({ message: 'Course detail not found' });
        }

        res.status(200).json({ message: 'Course detail deleted successfully' });
    } catch (error) {
        console.error('Error deleting course detail:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createCourseDetail, getAllCourseDetails, getCourseDetailById, updateCourseDetail, deleteCourseDetail,getCourseDetailsByCourseId };
