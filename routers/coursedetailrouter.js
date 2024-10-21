const express = require('express');
const router = express.Router();
const {
    createCourseDetail,
    getAllCourseDetails,
    getCourseDetailById,
    updateCourseDetail,
    deleteCourseDetail,
    getCourseDetailsByCourseId
} = require('../controllers/coursedetailcontroller');
const { verifyToken, isAdmin, isUser } = require('../middleware/auth');
const User = require('../models/usermodel');

// Route to create a new course detail (Admin only)
router.post('/:courseid', verifyToken, isUser, isAdmin, createCourseDetail);

// Route to get all course details (Admin & Student)
router.get('/', verifyToken, isUser, getAllCourseDetails);

// Route to get a single course detail by ID (Admin & Student)
router.get('/:id', verifyToken, isUser, getCourseDetailById);

// Route to get a single course detail by courseID (Admin & Student)
router.get('/course/:courseid', verifyToken, isUser, getCourseDetailsByCourseId);



// Route to update a course detail (Admin only)
router.put('/:id', verifyToken, isAdmin, updateCourseDetail);

// Route to delete a course detail (Admin only)
router.delete('/:id', verifyToken, isAdmin, deleteCourseDetail);

module.exports = router;
