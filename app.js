const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate"); 
const ExpressError=require("./utils/ExpressError.js");

const listingRoutes=require("./routes/listing.js");
const reviewRoutes=require("./routes/review.js");

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

app.use("/listinges", listingRoutes); // Use the listing routes 
app.use("/listinges/:id/reviews",reviewRoutes);

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