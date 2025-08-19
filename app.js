const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const Listing=require("./models/listing.js");
const ExpressError=require("./utils/ExpressError.js");
const wrapAsync= require("./utils/wrapAsync.js");
const {listingSchema, reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const app=express();

app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

//connect to MongoDB

const MONGO_URL="mongodb://127.0.0.1:27017/Wanderlust";

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch(err=>{
    throw new Error("Failed to connect to MongoDB: " + err.message);
});

async function main(){
    await mongoose.connect(MONGO_URL);
} 
//validate the request body against the schema
//if validation fails, throw an ExpressError with status 400 and error message
const ValidateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
        const errorMessage=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errorMessage);
    }else{
        next();
    }
};
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

//show all the listings
app.get("/listinges",wrapAsync(async (req,res)=>{
    const listinges=await Listing.find();
    res.render("./listings/index.ejs",{allDataOfListings:listinges});
    
}));
//create a new listing
app.get("/listinges/new",(req,res)=>{
    res.render("./listings/new.ejs");
});
//save a new listing

app.post("/listinges",ValidateListing,wrapAsync(async (req,res)=>{
    const newListing=new Listing(req.body.listingObj);
    await newListing.save();
    res.redirect("/listinges");
})
);
//open a individual listing
app.get("/listinges/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const findData=await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{listing:findData});
})
);

// //edit a listing

app.get("/listinges/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const findData=await Listing.findById(id);
    res.render("./listings/edit.ejs",{data:findData});
}));
//update a listing

app.put("/listinges/:id",ValidateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listingObj});
    res.redirect("/listinges");
}));
//delete a listing
app.delete("/listinges/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    console.log("Deleting listing with ID:", id);
    await Listing.findByIdAndDelete(id);
    res.redirect("/listinges");
}));

//review a listing
app.post("/listinges/:id/review",validateReview,wrapAsync(async (req,res)=>{
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);

    await newReview.save();
    listing.reviews.push(newReview); // push review's ObjectId
    await listing.save();
    
    res.redirect(`/listinges/${id}`); // redirect to listing page
}));

//delete a review
app.delete("/listinges/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    console.log("Deleting review...");
    let {id,reviewId}=req.params;
    console.log(id,reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listinges/${id}`);
    
}));

// Utility route to clean orphaned review IDs from all listings
app.get("/cleanup-reviews", wrapAsync(async (req, res) => {
    const validReviewIds = (await Review.find({}, "_id")).map(r => r._id.toString());
    const listings = await Listing.find();
    let cleaned = 0;
    for (const listing of listings) {
        const originalLength = listing.reviews.length;
        listing.reviews = listing.reviews.filter(id => validReviewIds.includes(id.toString()));
        if (listing.reviews.length !== originalLength) {
            await listing.save();
            cleaned++;
        }
    }
    res.send(`Cleaned orphaned review IDs from ${cleaned} listings.`);
}));

//404 error handler
app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});
app.use((err,req,res,next)=>{ 
    let {status=500, message="something went wrong"} = err;
    res.status(status).render("./listings/error.ejs", { status, message });
}); 
app.listen(8080,(err)=>{
    if(err){
        console.error("Error starting server:", err);
    }else{
        console.log("Server is running on port 8080");
    }
    
});