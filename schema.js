// this file is for server side validation using joi
const Joi=require("joi");

module.exports.ListingSchema=Joi.object({
    Listing :Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        country:Joi.string().required(),
        location:Joi.string().required(),
        price:Joi.number().required().min(0), 
    }).required()
})