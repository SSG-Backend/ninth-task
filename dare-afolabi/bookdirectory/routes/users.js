var express = require('express');
const users = require('../controllers/users');
var router = express.Router();


// Login Page
router.get('/login', users.getLoginPage);


// Register Page
router.get('/register', users.getRegistrationPage);


// Add (Registration) User
router.post('/register', users.addUser);


// Login Handler
router.post('/login', users.userLogin);


//Logout Handler
router.get('/logout', users.userLogout);


module.exports = router;

