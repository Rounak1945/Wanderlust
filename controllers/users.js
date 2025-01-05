// All callbacks related to user routes

const User = require("../models/user.js");

const renderSignUp = (req, res) => {
    res.render("users/signup.ejs");
};

const signUp = async (req, res) => {
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
};

const renderLogIn =  (req, res) => {
    res.render("users/login.ejs");
};

const logIn = async (req, res) => {
    req.flash("success", "Welcomeback to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
};

const logOut = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
};

module.exports = {renderSignUp, signUp, renderLogIn, logIn, logOut};