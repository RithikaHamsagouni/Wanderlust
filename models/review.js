const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// POST Review Route
router.post("/", async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding review");
  }
});

// DELETE Review Route
router.delete("/:reviewId", async (req, res) => {
  try {
    let { id, reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting review");
  }
});

module.exports = router;