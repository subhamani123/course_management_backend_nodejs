const express = require('express');
const { verifyToken, isAdmin, isUser } = require('../middleware/auth'); // Adjust the path to your middleware
const {
    createCourse,
    getCourses,
    updateCourse,
    deleteCourse,
    getAllUsers
} = require('../controllers/coursecontroller');
const User = require('../models/usermodel');

const router = express.Router();

// Route to create a new course (Admin only)
router.post('/', verifyToken,isUser, isAdmin, createCourse);

// Route to get all courses (Admin & Student)
router.get('/', verifyToken, isUser,getCourses);

// Route to update a course (Admin only)
router.put('/:id', verifyToken,isUser, isAdmin, updateCourse);

// Route to delete a course (Admin only)
router.delete('/:id', verifyToken, isAdmin, deleteCourse);

// Route to get all students and admins (Admin only)
router.get('/users', verifyToken, isAdmin, getAllUsers);

module.exports = router;

