const express = require("express");
const router = express.Router();
// middleware
const isAuth = require('../middleware/auth');
const AuthControllers = require('../controllers/AuthControllers');

// user by request
router.get('/me', isAuth, AuthControllers.me);

// register user
router.post("/register", AuthControllers.register);

// login user
router.post("/login", AuthControllers.login);

// send verification email
router.post("/verify-by-code", isAuth, AuthControllers.verifyByCode);

// send verification email
router.post("/send-verification-email", isAuth, AuthControllers.sendVerificationEmail);

module.exports = router;





