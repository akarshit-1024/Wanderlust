const Review=require("../models/review.js");
const express = require('express');
const Listing=require("../models/listing.js");
const wrapAsync= require("../utils/wrapAsync.js");
const router = express.Router({mergeParams:true}); 
const {isLogIn,validateReview,isReviewAuthor}=require("../middleware.js");


//review a listing
router.post("/",isLogIn,validateReview,wrapAsync(async (req,res)=>{
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    await newReview.save();
    listing.reviews.push(newReview); // push review's ObjectId
    await listing.save();
    res.redirect(`/listinges/${id}`); // redirect to listing page
}));

//delete a review
router.delete("/:reviewId",isLogIn,isReviewAuthor, wrapAsync(async (req, res) => {
    let {id,reviewId}=req.params;  
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listinges/${id}`);
    
}));

module.exports=router;