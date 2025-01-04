const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middlewares.js");


// Using Express Router
const router = express.Router();

// Sign UP
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync( async (req, res) => {
    try {
        let {username, email, password} = req.body;

        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        // immediate login after signup 
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        }); 
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

// Log In
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", 
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login", failureFlash: true
    }), 
    async (req, res) => {
    req.flash("success", "Welcomeback to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
});


// Log Out
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
});


module.exports = router;

// callbacks for both req.logout and req.login is similar