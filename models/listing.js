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
        default:"https://th.bing.com/th/id/OIP.jc9F2K6hEUYrWuCvoV1K4gHaFj?w=210&h=180&c=7&r=0&o=5&cb=iwc2&dpr=1.3&pid=1.7",
        set:(v)=>v===""?"https://th.bing.com/th/id/OIP.jc9F2K6hEUYrWuCvoV1K4gHaFj?w=210&h=180&c=7&r=0&o=5&cb=iwc2&dpr=1.3&pid=1.7":v,
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
    }]
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;