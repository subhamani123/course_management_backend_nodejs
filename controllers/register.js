const bcrypt = require('bcrypt');
const User = require('../models/usermodel'); 
const Student = require('../models/studentmodel'); 
const { hashGenerator } = require('../helper/hashing'); // Import hashGenerator

// Register Controller
const registerUser = async (req, res) => {
    const { username, email, password, role, mobile, college, department } = req.body;

    try {
        // Hash the password using hashGenerator
        const hashedPassword = await hashGenerator(password);

        // Check if the user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new User
        const newUser = new User({
            email,
            password: hashedPassword,
            role,
        });

        // If the role is 'student', create a new Student and link it to the User
        if (!role || role === 'student') {
            const newStudent = new Student({
                username,
                mobile,
                college,
                department,
                userDetails: newUser._id, // Link the student to the user
            });

            // Save the Student to the database
            await newStudent.save();

            // Link the Student to the User
            newUser.student = newStudent._id;
        }

        // Save the User to the database
        await newUser.save();

        // Return success response
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser };
