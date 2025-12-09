const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");   // IMPORTANT – you forgot this

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?auto=format&fit=crop&w=800&q=60",
    },
    filename: {
      type: String,
      default: "listingimage",
    },
  },

  price: Number,
  location: String,
  country: String,

  // FIXED: ARRAY of reviews
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
});

// FIXED DELETE MIDDLEWARE
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
  }
});

module.exports = mongoose.model("Listing", listingSchema);

