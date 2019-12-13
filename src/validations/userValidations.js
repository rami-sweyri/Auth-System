const Joi = require('joi');

function validateSignup(user) {
    
    const schema = {
        email: Joi.string().min(12).max(120).regex(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/).required().email(),
        phoneNumber: Joi.string().min(8).max(30).required(),
        userName: Joi.string().min(5).max(20).required(),
        password: Joi.string().min(8).max(255).required(),
    };
    return Joi.validate(user, schema);
}

function validateLogin(user) {
    const schema = {
        email: Joi.string().min(12).max(120).regex(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/).email(),
        phoneNumber: Joi.string().min(8).max(30),
        userName: Joi.string().min(5).max(20),
        password: Joi.string().min(8).max(255).required(),
    };
    return Joi.validate(user, schema);
}

exports.validateSignup = validateSignup;
exports.validateLogin = validateLogin;