const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");



// Middleware 1
// function for server side validation using joy
const validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if(result.error) {
        let errMsg = result.error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else next();
}

// Middleware 2
// function for server side validation using joy
const validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    if(result.error) {
        let errMsg = result.error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else next();
}

// const isLoggedIn = (req, res, next) => {
//     if(!req.isAuthenticated()) {
//         req.flash("error", "You must be Logged In!");
//         res.redirect("/login");
//         return;
//     }
//     else next();
// }

// Middleware 3
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

// Middleware 4
const saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// Middleware 5
const isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    // checking owner
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// Middleware 6
const isAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    // checking owner
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = {isLoggedIn, saveRedirectUrl, isOwner, isAuthor, validateListing, validateReview};

// Here we need to save url in req.locals because after login passport resets req.session