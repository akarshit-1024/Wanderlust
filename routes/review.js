const Review=require("../models/review.js");
const express = require('express');
const Listing=require("../models/listing.js");
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const { reviewSchema}=require("../schema.js");
const router = express.Router({mergeParams:true});

//for review validation
const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const errorMessage=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errorMessage);
    }else{
        next();
    }
};

//review a listing
router.post("/",validateReview,wrapAsync(async (req,res)=>{
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);

    await newReview.save();
    listing.reviews.push(newReview); // push review's ObjectId
    await listing.save();
    res.redirect(`/listinges/${id}`); // redirect to listing page
}));

//delete a review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    console.log("Deleting review...");
    let {id,reviewId}=req.params;
    console.log(id,reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listinges/${id}`);
    
}));

module.exports=router;