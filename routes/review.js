const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeparams is method to use the parent params also..!!
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { reviewSchema } = require("../schema.js");
const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
} = require("../middleware.js");

const reviewContoller = require("../controllers/reviews.js");

// routes for reviews..!!
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewContoller.createReview)
);

// delete route for reviews

router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(reviewContoller.deleteReview)
);

module.exports = router;
