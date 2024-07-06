const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,validateListing,isOwner } = require("../middleware.js");

const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});




const listingController = require("../controllers/listings.js");




// INDEX ROUTE: get request on /listings..!!
router.get("/", wrapAsync(listingController.index));

// CREATE ROUTE.. for new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.post(
  "/",
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.createListing)
)



// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingController.renderEditForm)
);

// put request
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

// show route to print the data of clicked title

router.get("/:id", wrapAsync(listingController.showListing));

router.delete("/:id", isLoggedIn, isOwner,wrapAsync(listingController.deleteListing));

module.exports = router;
