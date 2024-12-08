
const Listing = require("./models/listing"); 
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);
    // console.log(req.path, "..", req.originalUrl); // original path ki value save kr k fr direct yhi redirect krenge
                                                     // ager logged in hua tab save nhi krwna pdega bz tab toh direct he new list add krne wala page khul jaega
    if (!req.isAuthenticated()) {
        // yha nhi hai logged in toh save krwaenge
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!"); 
        return res.redirect("/login");
    }
    next();
};


// toh hum req.session.redirectUrl ko locals mai save kraenge bz (passport) isko delete nhi kr skta
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}; 


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner3.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


// function to validate the Listingschema
module.exports.validateListing = async (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}; 


// function to validate the Reviewschema
module.exports.validateReview = async (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}; 



module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}