const express=require('express');
const Listing=require("../models/listing.js");
const wrapAsync= require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const router = express.Router();

const ValidateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
        const errorMessage=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errorMessage);
    }else{
        next();
    }
};

//show all the listings
router.get("/",wrapAsync(async (req,res)=>{
    const listinges=await Listing.find();
    res.render("./listings/index.ejs",{allDataOfListings:listinges});
    
}));
//create a new listing
router.get("/new",(req,res)=>{
    res.render("./listings/new.ejs");
});
//save a new listing

router.post("/",ValidateListing,wrapAsync(async (req,res)=>{
    const newListing=new Listing(req.body.listingObj);
    await newListing.save();
    res.redirect("/listinges");
})
);
//open a individual listing
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const findData=await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{listing:findData});
})
);

// //edit a listing

router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const findData=await Listing.findById(id);
    res.render("./listings/edit.ejs",{data:findData});
}));
//update a listing

router.put("/:id",ValidateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listingObj});
    res.redirect("/listinges");
}));
//delete a listing
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    console.log("Deleting listing with ID:", id);
    await Listing.findByIdAndDelete(id);
    res.redirect("/listinges");
}));

module.exports = router;
