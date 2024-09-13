
const Joi = require('joi');

const userSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().optional().allow(''), 
  password: Joi.string().min(6).max(30).required()
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().min(1).optional(),
  lastName: Joi.string().min(1).optional(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().optional().allow(''),
  password: Joi.string().min(6).max(30).optional()
});

module.exports = {
  userSchema,
  updateUserSchema
};

