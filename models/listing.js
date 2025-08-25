const mongoose=require("mongoose");
const Review = require("./review");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:"https://c4.wallpaperflare.com/wallpaper/756/599/630/man-made-udaipur-hotel-hotel-india-wallpaper-preview.jpg",
        set:(v)=>v===""?"https://c4.wallpaperflare.com/wallpaper/756/599/630/man-made-udaipur-hotel-hotel-india-wallpaper-preview.jpg":v,
         // if image is not provided, set a default value
    },  
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;