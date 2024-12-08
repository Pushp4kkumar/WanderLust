const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn,   isReviewAuthor } = require("../middlewares.js");

const reviewController = require("../controllers/reviews.js");


// Reviews => POST Route
router.post(
    "/", 
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

// Delete Review Route
router.delete(
    // "/listings/:id/reviews/:reviewId",
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);


module.exports = router;