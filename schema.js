const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(""),
    price: Joi.number().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),

    image: Joi.object({
      url: Joi.string().allow(""),
      filename: Joi.string().allow("")
    }).optional()
  }).required()
});

