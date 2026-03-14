const Joi = require('joi');
const addProductSchema = Joi.object({
  name: Joi.string().min(3).required(),
  price: Joi.number().positive().required(),
  stock:Joi.string().min(0).max(8).required(),
});
module.exports = {addProductSchema };