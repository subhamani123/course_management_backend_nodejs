const express = require('express');
const router = express.Router();
const {  completeStatus } = require('../controllers/progresscontroller');
const { verifyToken, isAdmin, isUser,countAssignments } = require('../middleware/auth');
const User = require('../models/usermodel');



//Complete status
router.post('/status/:courseid',verifyToken,isUser,countAssignments,completeStatus);


 

module.exports = router;
