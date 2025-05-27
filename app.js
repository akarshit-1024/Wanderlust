const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const engine=require("ejs-mate");
const Listing=require("./models/listing.js");
const app=express();

app.engine("ejs",engine);
app.set("view engine","ejs");
//app.set("views",path.join(__dirname,"views"));
//app.use(express.static(path.join(__dirname,"public")));
//app.use(methodOverride("_method"));
// app.use(express.urlencoded({extended:true}));

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

// listing route
// app.get("/listings",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"Sample Listing",
//         discription:"This is a sample listing description.",
//        // image:"https://th.bing.com/th/id/OIP.jc9F2K6hEUYrWuCvoV1K4gHaFj?w=210&h=180&c=7&r=0&o=5&cb=iwc2&dpr=1.3&pid=1.7",
//         price:100,
//         location:"UP",
//         country:"USA"
//     });
//     await sampleListing.save();
//     console.log("Sample listing created");
// });


app.listen(8080,()=>{
    console.log("Server is running on port 8080");
});