const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isAuthor, validateReview} = require("../middlewares.js");


// Using Express Router
const router = express.Router({mergeParams: true});
// merparams: for merging params of parent routes with child routes
// parant route is that common route which is in app.js

// Requiring controller
const reviewController = require("../controllers/reviews.js");


// ADD Review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// DELETE Review route
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(reviewController.destroy));

module.exports = router;
