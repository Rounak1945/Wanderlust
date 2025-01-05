const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middlewares.js");


// Requiring controller
const listingController = require("../controllers/listings.js");

// Using Express Router
const router = express.Router();


// Routes :

// show all route(Index route)
router.get("/", wrapAsync(listingController.index));

// New route 
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Create route
router.post("/", isLoggedIn, validateListing, wrapAsync (listingController.createListing));

// Show route
router.get("/:id", wrapAsync (listingController.showListing));

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm));

// Update route
router.put("/:id", validateListing, isLoggedIn, isOwner, wrapAsync(listingController.editListing));

// Delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroy));

module.exports = router;