const Joi = require('joi');

// Corrected listingSchema
module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    // Corrected image validation to expect an object with a URL
    image: Joi.object({
        url: Joi.string().allow("", null),
        filename: Joi.string().allow("", null)
    }).optional()
}).required();

// Corrected reviewSchema
module.exports.reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
}).required();