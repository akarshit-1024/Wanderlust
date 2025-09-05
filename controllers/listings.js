const Listing = require("../models/listing.js");
const axios = require("axios");


module.exports.index = async (req, res) => {
    const listinges = await Listing.find();
    res.render("./listings/index.ejs", { allDataOfListings: listinges });

};

module.exports.createNewListingForm = (req, res) => {
    res.render("./listings/new.ejs");

};

module.exports.createNewListing = async (req, res) => {
    const newListing = new Listing(req.body.listingObj);
    const {location,country} = newListing;
    const searchQuery = `${location}, ${country}`;
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(searchQuery)}.json?key=${process.env.MAP_API_KEY}`;
    const response = await axios.get(url);
    const feature = response.data.features[0];

    if (!feature) {
        req.flash("error", "Location not found. Please try again.");
        return res.redirect("/listinges/new");
    }

    // ✅ save GeoJSON properly
    newListing.geometry = {
        type: "Point",
        coordinates: feature.geometry.coordinates  // [lng, lat]
    };

    let { path, filename } = req.file;
    newListing.image = { url: path, filename: filename };
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listinges");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const findData = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!findData) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listinges");
    }
    res.render("./listings/show.ejs", { listing: findData });
}
module.exports.editROute = async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id);

    let originalUrl = data.image.url;
    let originalImageUrl = originalUrl.replace("/upload", "/upload/w_300,h_200");

    res.render("./listings/edit.ejs", { data, originalImageUrl });
};
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listingObj });

    if (typeof req.file !== "undifined") {
        let { path, filename } = req.file;
        listing.image = { url: path, filename: filename };
        await listing.save();
    }
    req.flash("success", "Listing updated sucessfully!");
    res.redirect(`/listinges/${id}`);
};
module.exports.distroyListing = async (req, res) => {
    let { id } = req.params;
    console.log("Deleting listing with ID:", id);
    await Listing.findByIdAndDelete(id);
    req.flash("error", "Successfully deleted the listing!");
    res.redirect("/listinges");
}