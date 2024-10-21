const express = require('express');
const { createAssignment, getAssignments, updateAssignment, deleteAssignment,submitAssignment,countSubmittedAssignments,verifyAssignment } = require('../controllers/assignmentcontroller');
const { verifyToken, isAdmin, isUser,countAssignments } = require('../middleware/auth');
const User = require('../models/usermodel');


const router = express.Router();

// Create a new assignment (Admin only)
router.post('/:id', verifyToken,isUser, isAdmin, createAssignment);

// Get all assignments (Admin & Student)
router.get('/', verifyToken,getAssignments);

// Update an assignment (Admin only)
router.put('/:id', verifyToken, isAdmin, updateAssignment);

// Delete an assignment (Admin only)
router.delete('/:id', verifyToken, isAdmin, deleteAssignment);

//Submit the assignment (Student )
router.post('/submit/:coursedetailid',verifyToken,isUser,submitAssignment)

//Count submitted assignments
router.get('/count/:courseid',verifyToken,isUser,countSubmittedAssignments)


//verify the Assignment by Admin
router.post('/verifyAssignment/:submissionId',verifyToken,isAdmin,verifyAssignment)

module.exports = router;
