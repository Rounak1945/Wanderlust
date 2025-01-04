// const isLoggedIn = (req, res, next) => {
//     if(!req.isAuthenticated()) {
//         req.flash("error", "You must be Logged In!");
//         res.redirect("/login");
//         return;
//     }
//     else next();
// }


// For giving users their previously asked post login page
const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be Logged In!");
        res.redirect("/login");
        return;
    }
    next();
}

const saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports = {isLoggedIn, saveRedirectUrl};

// Here we need to save url in req.locals because after login passport resets req.session