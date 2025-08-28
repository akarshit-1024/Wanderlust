const express = require('express');
const router = express.Router(); 
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirect } = require("../middleware.js");
const controllerUser = require("../controllers/user.js");

router.route("/signup")
    .get(controllerUser.signUpForm)
    .post(wrapAsync(controllerUser.newUserLogIn));

router.route("/login")
    .get(controllerUser.logInForm)
    .post(saveRedirect, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        controllerUser.userLogIn);

router.get("/logout", controllerUser.userLogOut);

module.exports = router;