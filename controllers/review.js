const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.createReview=async (req,res)=>{
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    await newReview.save();
    listing.reviews.push(newReview); // push review's ObjectId
    await listing.save();
    res.redirect(`/listinges/${id}`); // redirect to listing page
};

module.exports.deleteReview=async (req, res) => {
    let {id,reviewId}=req.params;  
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listinges/${id}`);
    
};