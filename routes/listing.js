const express = require('express');
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLogIn, ValidateListing, isOwner } = require("../middleware.js");
const router = express.Router(); 

//show all the listings
router.get("/", wrapAsync(async (req, res) => {
    const listinges = await Listing.find();
    res.render("./listings/index.ejs", { allDataOfListings: listinges });

}));
//create a new listing
router.get("/new", isLogIn, (req, res) => {
    res.render("./listings/new.ejs");

});
//save a new listing

router.post("/", ValidateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listingObj);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listinges");
})
);
//open a individual listing
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const findData = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!findData) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listinges");
    }
    res.render("./listings/show.ejs", { listing: findData });
})
);

// //edit a listing

router.get("/:id/edit", isLogIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const findData = await Listing.findById(id);
    //console.log(req.user+"........."+currentUser);
    res.render("./listings/edit.ejs", { data: findData });
}));
//update a listing

router.put("/:id", isLogIn, isOwner, ValidateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listingObj });
    req.flash("success", "Listing updated sucessfully!");
    res.redirect(`/listinges/${id}`);
}));
//delete a listing
router.delete("/:id", isLogIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log("Deleting listing with ID:", id);
    await Listing.findByIdAndDelete(id);
    req.flash("error", "Successfully deleted the listing!");
    res.redirect("/listinges");
}));

module.exports = router;
