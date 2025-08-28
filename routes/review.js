const express = require('express'); 
const wrapAsync= require("../utils/wrapAsync.js");
const router = express.Router({mergeParams:true}); 
const {isLogIn,validateReview,isReviewAuthor}=require("../middleware.js");
const controllerReview=require("../controllers/review.js");


//review a listing
router.post("/",isLogIn,validateReview,wrapAsync(controllerReview.createReview));

//delete a review
router.delete("/:reviewId",isLogIn,isReviewAuthor, wrapAsync(controllerReview.deleteReview));

module.exports=router;