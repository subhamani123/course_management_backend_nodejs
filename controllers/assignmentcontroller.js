const Assignment = require('../models/assignment');
const CourseDetails = require('../models/coursedetail');
const Submission = require('../models/submission');
const User = require('../models/usermodel');
const Course = require('../models/course');

// Create a new assignment (Admin only)
const createAssignment = async (req, res) => {
    const { tasks, link, coursedetails } = req.body;

    try {
        // Create the new assignment
        const { id } = req.params;
        
        const newAssignment = new Assignment({
            tasks,
            link,
            coursedetails,
        });

        const savedAssignment = await newAssignment.save();

        // Optionally, update the course detail to reference this assignment
        await CourseDetails.findByIdAndUpdate(coursedetails, { $set: { assignments: savedAssignment._id } });

        res.status(201).json({ message: 'Assignment created successfully', assignment: savedAssignment });
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all assignments
const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find().populate('coursedetails');
        res.status(200).json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update an assignment (Admin only)
const updateAssignment = async (req, res) => {
    const { id } = req.params;
    const { tasks, link, coursedetails } = req.body.assignments;

    try {
        // Check if the user is an admin
        const user = await User.findById(req.user.id);
       
        // Update the assignment
        const updatedAssignment = await Assignment.findByIdAndUpdate(
            id,
            { tasks, link, coursedetails },
            { new: true }
        );

        if (!updatedAssignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.status(200).json({ message: 'Assignment updated successfully', assignment: updatedAssignment });
    } catch (error) {
        console.error('Error updating assignment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete an assignment (Admin only)
const deleteAssignment = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the user is an admin
        const user = await User.findById(req.user.id);
       

        // Delete the assignment
        const deletedAssignment = await Assignment.findByIdAndDelete(id);

        if (!deletedAssignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//assignment submission by student
const submitAssignment = async (req, res) => {
    const { coursedetailid } = req.params;
    const { assignmentLink } = req.body;
    try {
        

        // Fetch the course detail and find the assignment ID
        const courseDetail = await CourseDetails.findById(coursedetailid).select('assignments course');
        if (!courseDetail || !courseDetail.assignments) {
            return res.status(404).json({ message: 'Course details or assignments not found' });
        }
        console.log(courseDetail.assignments," : : :courseDetail.assignments")
        // Assuming assignments is an array, you need to find the correct assignment ID
        const assignmentid = courseDetail.assignments//.find(assign => assign._id.toString() === req.params.assignmentid);
        if (!assignmentid) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if the assignment exists in the Assignment collection
        const existingAssignment = await Assignment.findById(assignmentid);
        if (!existingAssignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        const alreadysubmitted=await Submission.findOne({user:req.user.id,assignment:assignmentid})
        if(alreadysubmitted){
            return res.status(400).json({message:"Assignment already submitted for this module by the user"})
        }

        // Create a new submission
        const submission = new Submission({
            assignmentLink,
            user: req.user.id,
            course:courseDetail.course,
            assignment: assignmentid,
            studentSubmissionStatus:true
        });

        await submission.save();

        // Add the user ID to the completed array and save

        res.status(201).json({ message: 'Assignment Submitted Successfully' });
    } catch (error) {
        console.error('Error in submitting assignment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//Count Submitted Assignments 
const countSubmittedAssignments=async(req,res)=>{
    const { courseid }=req.params
    try {
        // Find all submissions for the given student
        const submissions = await Submission.find({ user:req.user.id,course:courseid });
        const course=await Course.findById(courseid)
        if (!course){
            return res.status(400).json({message:"Course Not found"})
        }
        const totalCount=course.courseDetails.length
        
        if (!submissions.length) {
            return res.status(500).json({error:'No submissions found for this student.'});
        }
        // Count pending submissions and completed submissions
        const completedCount = submissions.filter(submission => submission.adminApproval === 'Completed').length;
        const pendingCount = submissions.filter(submission => submission.adminApproval === 'Pending').length;
        return res.status(200).json({pendingCount,completedCount,totalCount})
    }
catch(error){
    return res.status(500).json({message:"Server Error"})
    
}
}

//verify the assignment by admin and update the status by submission id
const verifyAssignment=async (req,res)=>{
    const {submissionId}=req.params
    const {adminApproval}=req.body
    try{
        const submitted=await Submission.findById(submissionId)
        
        if(!submitted){
            return res.status(404).json({message:"No Assignmnets were submitted in that ID"})
        }

        //Update the admin approval status
        submitted.adminApproval=adminApproval

        //await submitted.save()
        if(adminApproval==='Redo'){
            submitted.studentSubmissionStatus=false
        }
        else if(adminApproval==='Completed'){
            const assignment=await Assignment.findById(submitted.assignment)
            if (!assignment) {
                return res.status(404).json({ message: "Assignment not found" });
            }  
      // Add the user ID to the completed array and save
      if (!assignment.completed.includes(submitted.user)){
        assignment.completed.push(submitted.user);
       await assignment.save();}
       submitted.studentSubmissionStatus = true;
        }
        await submitted.save();
        return res.status(200).json({message:"Submission status updated successfully"})

    }
    catch(error){
        return res.status(500).json({message:"Server Error"})
        
    }
}


module.exports = { createAssignment, getAssignments, updateAssignment, deleteAssignment,submitAssignment,countSubmittedAssignments,verifyAssignment };
