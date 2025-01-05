const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isAuthor, validateReview} = require("../middlewares.js");


// Using Express Router
const router = express.Router({mergeParams: true});
// merparams: for merging params of parent routes with child routes
// parant route is that common route which is in app.js


// ADD Review route
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    console.log("review added successfully");
    req.flash("success", "New Review Added!")
    res.redirect(`/listings/${id}`);
}));

// DELETE Review route
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    console.log("Review Deleted!");
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!")
    res.redirect(`/listings/${id}`);
}))

module.exports = router;
