const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// Routers
const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");

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

// ---- SESSION & AUTH SETUP ----
app.use(cookieParser("mysecret"));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// OPTION 1: If you want to login with EMAIL
// Uncomment this and comment out the default strategy below
/*
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  User.authenticate()
));
*/

// OPTION 2: Default - Login with USERNAME (current setup)
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash middleware - make messages available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user; // Make current user available in views
  next();
});

// Demo user route (commented out)
/*
app.get("/demouser", async(req, res) => {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "delta-student"
  });
  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
});
*/

// COOKIE ROUTES (for testing)
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

// Routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// 404 handler - must be after all other routes
app.use((req, res, next) => {
  next(new ExpressError("Page not found!", 404));
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});