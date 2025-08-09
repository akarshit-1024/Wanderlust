const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const Listing=require("./models/listing.js");
const ExpressError=require("./utils/ExpressError.js");
const wrapAsync= require("./utils/wrapAsync.js");
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

app.post("/listinges",wrapAsync(async (req,res)=>{
    if(!req.body.listingObj){
        throw new ExpressError(400,"Invalid Listing Data for listings");
    };
    const newListing=new Listing(req.body.listingObj);
    await newListing.save();
    res.redirect("/listinges");
})
);
//open a individual listing
app.get("/listinges/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const findData=await Listing.findById(id);
    res.render("./listings/show.ejs",{data:findData});
})
);

// //edit a listing

app.get("/listinges/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const findData=await Listing.findById(id);
    res.render("./listings/edit.ejs",{data:findData});
}));
//update a listing

app.put("/listinges/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listingObj});
    res.redirect("/listinges");
}));
//delete a listing
app.delete("/listinges/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listinges");
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