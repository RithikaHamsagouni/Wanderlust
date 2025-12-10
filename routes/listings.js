// routes/listings.js
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");

// Validation middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

// INDEX - All listings
router.get("/", wrapAsync(async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", { alllistings: listings });
}));

// NEW - Form to create listing
router.get("/new", (req, res) => {
  res.render("listings/new");
});

// CREATE - Add new listing
router.post("/", validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success","New Listing Created!");
  res.redirect("/listings");
}));

// SHOW - Show single listing
router.get("/:id", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("reviews");
  if(!listing){
     req.flash("error","Listing u requested for doesnot exist !");
     res.redirect("/listings");
  }
  
  
  res.render("listings/show", { listing });
}));

// EDIT - Edit form
router.get("/:id/edit", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if(!listing){
     req.flash("error","Listing u requested for doesnot exist !");
     res.redirect("/listings");
  }
  
  res.render("listings/edit", { listing });
}));

// UPDATE - Update listing
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
   req.flash("success","Listing Updated!");
  res.redirect(`/listings/${req.params.id}`);
}));

// DELETE - Delete listing and associated reviews
router.delete("/:id", wrapAsync(async (req, res) => {
  let {id}= req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success","Listing Deleted!");
  // Reviews are deleted automatically if middleware exists in listing.js
  res.redirect("/listings");
}));

module.exports = router;
