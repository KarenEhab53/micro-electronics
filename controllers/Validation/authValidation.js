const Joi = require('joi');
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password:Joi.string().min(6).max(8).required(),
  role:Joi.string().valid("admin","user").default("user")
});
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(8).required(),
});
module.exports={registerSchema,loginSchema}