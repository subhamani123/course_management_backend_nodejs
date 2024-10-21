const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
const Course=require('../models/course')
const Submission = require('../models/submission');
const getAssignmentCounts=require('../helper/count')
require('dotenv').config();

// Middleware to count submitted assignments
const countAssignments = async (req, res, next) => {
    const { courseid } = req.params;
    try {
        const counts = await getAssignmentCounts(req.user.id, courseid);
        req.assignmentCounts = counts; // Attach counts to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(500).json({ message: error.message || "Server Error" });
    }
};

//VerifyToken
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            role: decoded.role,
            email: decoded.email
        };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

const isAdmin = async (req, res, next) => {
    try {
        // Fetch the user using the email from req.user
        const user = await User.findOne({ email: req.user.email });

        // Check if the user exists and if their role is 'admin'
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Admin role required for this action!" });
        }

        // Proceed to the next middleware if the user is an admin
        next();
    } catch (error) {
        console.error('Authorization error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
const isUser = async (req, res, next) => {
    try {
        // Fetch the user using the email from req.user
        const user = await User.findOne({ email: req.user.email });

        // Check if the user exists and if their role is 'admin'
        if (!user ) {
            return res.status(403).json({ message: "User required for this action!" });
        }

        // Proceed to the next middleware if the user is an admin
        next();
    } catch (error) {
        console.error('Authorization error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { verifyToken, isAdmin, isUser ,countAssignments };
