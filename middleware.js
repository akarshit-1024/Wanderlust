const { listingSchema } = require("./schema.js");
const Listing = require("./models/listing.js");
const ExpressError=require("./utils/ExpressError.js");


module.exports.isLogIn=(req,res,next)=>{
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirect=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing =await Listing.findById(id);
    if(!req.user || listing.owner.equals(req.user._id)){
        req.flash("error","You don't have permission to do that!");
        return res.redirect(`/listinges/${id}`);
    }
    next();
}
module.exports.ValidateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    } else {
        next();
    }
};