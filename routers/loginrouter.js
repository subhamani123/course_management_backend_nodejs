const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/login'); 
const hashValidate=require('../helper/hashing.js');

// Login route
router.post('/login', loginUser);

module.exports = router;
