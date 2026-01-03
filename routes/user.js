const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlleware.js");
const userController = require("../controllers/users.js");

//SIGNUP
router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signup))

//LOGIN
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), wrapAsync(userController.login))

//LOGOUT    
router.get("/logout", userController.logout)

module.exports = router;