const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateListing, isOwner } = require("../middlewares.js");
const listingController = require("../controllers/listings.js");

const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); 


 
 
// ROute to all show all listing
router.get("/", wrapAsync(listingController.index));

// Route to create NEW LISTING
router.get("/new", isLoggedIn, listingController.renderNewForm); 

// Show particular route
router.get("/:id", wrapAsync(listingController.showListing));

 
// Create newList 
router.post(
    "/",
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
);

// through multer
// router.post("/", upload.single('listing[image]'), (req, res, next) => {
//     res.send(req.file);
// });

//Edit Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing)
);

//Update Route
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing) 
);

//Delete Route
router.delete(
    "/:id", 
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);
     
module.exports = router;