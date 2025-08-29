const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLogIn, ValidateListing, isOwner } = require("../middleware.js");
const contListing = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); // configure multer to save files to 'uploads/' directory
//const { storage } = require('../cloudinary');
//index route
router.route("/")
    .get(wrapAsync(contListing.index))                                 /*index route*/
    .post(isLogIn,
        
        upload.single('listingObj[image]'),
        wrapAsync(contListing.createNewListing))  /*create route*/
//create route
router.get("/new", isLogIn, contListing.createNewListingForm);
//save route
router
//open listing route
router.route("/:id")
    .get(wrapAsync(contListing.showListing))                                         /*show route*/
    .put(isLogIn, isOwner, ValidateListing, wrapAsync(contListing.updateListing))   /*update route*/
    .delete(isLogIn, isOwner, wrapAsync(contListing.distroyListing));              /*destroy route*/
//edit route

router.get("/:id/edit", isLogIn, isOwner, wrapAsync(contListing.editROute));

module.exports = router;
