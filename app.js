const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = requir("./utils/ExpressError.js");

app.set("veiw engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended: true})); 
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
})

async function main(){
    await mongoose.connect(mongo_url);
}


// Home route
app.get("/", (req, res) => {
    res.send("This is my root");
})
  
// show all route
app.get("/listings", wrapAsync( async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));


// New route 
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Create new route
app.post("/listings", wrapAsync (async (req, res) => {
    // let{title, description, image, price, country, location} = req.body;
    // let listing = req.body.listing;
    if(!req.body.listing) {
        throw new ExpressError(400, "Send Valid Data For Listing!");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// Show route
app.get("/listings/:id", wrapAsync (async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

// Edit route
app.get("/listings/:id/edit", wrapAsync (async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// Update route
app.put("/listings/:id", wrapAsync( async (req, res) => {
    if(!req.body.listing) {
        throw new ExpressError(400, "Send Valid Data For Listing!");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// Delete route
app.delete("/listings/:id", wrapAsync( async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went Wrong!"} = err;
    res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Listning on port: 8080");
})