// All callbacks related to review routes

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const createReview = async (req, res) => {
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
};

const destroy = async (req, res) => {
    console.log("Review Deleted!");
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!")
    res.redirect(`/listings/${id}`);
};


module.exports = {createReview, destroy};