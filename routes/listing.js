const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middlewares.js");


// Using Express Router
const router = express.Router();

// function for server side validation using joy
const validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if(result.error) {
        let errMsg = result.error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else next();
}

// Routes :
// show all route
router.get("/", wrapAsync( async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));


// New route 
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// Create route
router.post("/", 
    validateListing,
    wrapAsync (async (req, res) => {
    // let{title, description, image, price, country, location} = req.body;
    // let listing = req.body.listing;
    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

// Show route
router.get("/:id", wrapAsync (async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

// Edit route
router.get("/:id/edit", isLoggedIn, wrapAsync (async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

// Update route
router.put("/:id", 
    validateListing, 
    isLoggedIn,
    wrapAsync( async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
}));

// Delete route
router.delete("/:id", isLoggedIn, wrapAsync( async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
}));

module.exports = router;