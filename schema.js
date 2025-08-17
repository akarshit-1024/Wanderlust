const joi=require('joi');

module.exports.listingSchema=joi.object({
    listingObj:joi.object({ 
        title:joi.string()
        .required()
        .min(3), // title should be at least 3 characters long
        description:joi.string().required(),
        image:joi.string().uri().allow('',null), // allow empty string for image
        price:joi.number().required()
        .min(0), // price should be a positive number
        country:joi.string().required(),
        location:joi.string().required(),
    }).required()
});

module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().required()
        .min(1).max(5), // rating should be between 1 and 5
        comment:joi.string().required()
    }).required()
});