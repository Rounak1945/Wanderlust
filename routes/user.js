const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");

const passport = require("passport");
const {saveRedirectUrl} = require("../middlewares.js");


// Using Express Router
const router = express.Router();

// Requiring controller
const userController = require("../controllers/users.js");

// SignUP page
router.get("/signup", userController.renderSignUp);

// Sign Up
router.post("/signup", wrapAsync(userController.signUp));

// LogIn Page
router.get("/login", userController.renderLogIn);

// Log In
router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.logIn);

// Log Out
router.get("/logout", userController.logOut);

module.exports = router;

// callbacks for both req.logout and req.login is similar