const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/register'); // Adjust the path according to your project structure
const hashGenerator=require('../helper/hashing.js');
const hashValidate=require('../helper/hashing.js');

// POST route for user registration
router.post('/register', registerUser);

module.exports = router;

