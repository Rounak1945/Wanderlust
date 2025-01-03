const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

// Requiring routers
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

// requiring session
const session = require("express-session");
const flash = require("connect-flash");



app.set("veiw engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended: true})); 
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


// For connecting to mongoose

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

// using session
const sessionOptions = {
    secret: "secretCode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// Middleware for flash messeges
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

// Home route
app.get("/", (req, res) => {
    res.send("This is my root");
})

// For routes starts with "/listings"
app.use("/listings", listings);
// For routes starts with "/listings/:id/reviews"
app.use("/listings/:id/reviews", reviews);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// costom error handler
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went Wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
});

app.listen(8080, () => {
    console.log("Listning on port: 8080");
})