const Listing = require("../models/listing.js");

module.exports.index=async (req, res) => {
    const listinges = await Listing.find();
    res.render("./listings/index.ejs", { allDataOfListings: listinges });

};

module.exports.createNewListingForm=(req, res) => {
    res.render("./listings/new.ejs");

};

module.exports.createNewListing=async (req, res) => {
    const newListing = new Listing(req.body.listingObj);
    let {path,filename}=req.file;
    newListing.image={url:path,filename:filename};
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listinges");
};

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const findData = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!findData) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listinges");
    }
    res.render("./listings/show.ejs", { listing: findData });
}
module.exports.editROute=async (req, res) => {
    let { id } = req.params;
    const findData = await Listing.findById(id);
    //console.log(req.user+"........."+currentUser);
    res.render("./listings/edit.ejs", { data: findData });
};
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listingObj });
    req.flash("success", "Listing updated sucessfully!");
    res.redirect(`/listinges/${id}`);
};
module.exports.distroyListing=async (req, res) => {
    let { id } = req.params;
    console.log("Deleting listing with ID:", id);
    await Listing.findByIdAndDelete(id);
    req.flash("error", "Successfully deleted the listing!");
    res.redirect("/listinges");
}