const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const Listing=require("./models/listing.js");
const ExpressError=require("./ExpressError");
const { deflateSync } = require("zlib");
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

//home route
app.get("/",(req,res)=>{res.send("home is working")});

//show all the listings
app.get("/listinges",async (req,res)=>{
    const listinges=await Listing.find();
    res.render("./listings/index.ejs",{allDataOfListings:listinges});
    
});
//create a new listing
app.get("/listinges/new",(req,res)=>{
    res.render("./listings/new.ejs");
});
//save a new listing

app.post("/listinges",async (req,res)=>{
    const newListing=new Listing(req.body.listingObj);
    await newListing.save();
    res.redirect("/listinges");
});
//open a individual listing
app.get("/listinges/:id",async (req,res)=>{
    let {id}=req.params;
    const findData=await Listing.findById(id);
    res.render("./listings/show.ejs",{data:findData});
});

// //edit a listing

app.get("/listinges/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const findData=await Listing.findById(id);
    res.render("./listings/edit.ejs",{data:findData});
});
//update a listing

app.put("/listinges/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listingObj});
    res.redirect("/listinges");
});
//delete a listing
app.delete("/listinges/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listinges");
});

//404 error handler
const checkError=(req,res,next)=>{
    const {token}=req.query;
    if(token==="1234"){
        next();
    }
    throw new ExpressError(401,"ACCESS DENIED");
};

app.get("/api",checkError,(req,res)=>{
    res.send("API is working");
});

app.use((err,req,res,next)=>{
    console.log("------Error Occurred------");
    let {status, message} = err;
    res.status(status).send(message);
});

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
});