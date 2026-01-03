module.exports.listingSchema = Joi.object({
    listing: Joi.object({  // Wrap in 'listing' object
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            url: Joi.string().allow("", null),
            filename: Joi.string().allow("", null)
        }).optional()
    }).required()
}).required();

module.exports.reviewSchema = Joi.object({
    review: Joi.object({  // Wrap in 'review' object
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
}).required();