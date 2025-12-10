const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// Show register form
router.get("/register", (req, res) => {
  res.render("users/register");
});

// Handle user registration
router.post("/register", async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    
    // Basic validation
    if (!email || !username || !password) {
      req.flash("error", "All fields are required");
      return res.redirect("/register");
    }
    
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    
    // Automatically login after registration
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to WanderLust!");
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

// Show login form
router.get("/login", (req, res) => {
  res.render("users/login");
});

// Handle login
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    // Redirect to the page user was trying to access, or default to root
    const redirectUrl = req.session.returnTo || "/";
    delete req.session.returnTo; // Clear the stored URL
    res.redirect(redirectUrl);
  }
);

// Handle logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
});

module.exports = router;