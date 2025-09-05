if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
};

const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate"); 
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const listingRoutes=require("./routes/listing.js");
const reviewRoutes=require("./routes/review.js");
const userRoutes=require("./routes/user.js");
const legalRoutes=require("./routes/legal.js");

const app=express();

app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));


const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch(err=>{
    throw new Error("Failed to connect to MongoDB: " + err.message);
});

async function main(){
    await mongoose.connect(dbUrl);
} 

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("error in mongo atlas store",err);
});

const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:Date.now()+4*24*60*60*1000, // 4 days
        maxAge:4*24*60*60*1000, // 4 days
        httpOnly:true, // 
        secure:false  // set to true if using HTTPS
    }
}



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());   
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.sucess=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
}); 

app.use("/listinges", listingRoutes); // Use the listing routes 
app.use("/listinges/:id/reviews",reviewRoutes);
app.use("/",userRoutes); // Use the user routes 
app.use("/",legalRoutes);

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