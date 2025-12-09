const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");


// Routers
const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");

const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser("mysecret"));   // <-- PLACE HERE

// ===== Cookie Testing Routes =====
app.get("/set-cookie", (req, res) => {
  res.cookie("username", "Rithika");
  res.send("Cookie set!");
});

app.get("/read-cookie", (req, res) => {
  res.send(req.cookies);
});

app.get("/set-signed", (req, res) => {
  res.cookie("auth", "12345", { signed: true });
  res.send("Signed cookie set!");
});

app.get("/read-signed", (req, res) => {
  res.send(req.signedCookies);
});

// ===== Use Routers =====
app.use("/listings", listingRoutes);               // Listings routes
app.use("/listings/:id/reviews", reviewRoutes);   // Nested reviews routes

// 404 handler
app.use((req, res, next) => {
  next(new ExpressError("Page not found!", 404));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
