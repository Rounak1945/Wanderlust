// All callbacks related to listing routes

const Listing = require("../models/listing.js");


const index =  async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

const renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

const showListing = async (req, res) =>{
    let {id} = req.params;

    // nesting of populates for details of references
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", 
            populate: {
                path: "author",
            }
        })
        .populate("owner");
    
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

const createListing = async (req, res) => {
    // let{title, description, image, price, country, location} = req.body;
    // let listing = req.body.listing;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

const renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

const editListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
};

const destroy = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
};

module.exports = {index, renderNewForm, showListing, createListing, renderEditForm, editListing, destroy};