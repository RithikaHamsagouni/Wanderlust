// routes/reviews.js
const express = require("express");
const router = express.Router({ mergeParams: true }); // Important for nested routes
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");

// CREATE review
router.post("/", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
   req.flash("success","New Review Created!");
  res.redirect(`/listings/${listing._id}`);
}));

// DELETE review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
   req.flash("success","Review Deleted!");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;

