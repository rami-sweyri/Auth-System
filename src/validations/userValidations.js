const Joi = require('joi');

function validateSignup(user) {
    const schema = {
        email: Joi.string().min(12).max(120).required().email(),
        phoneNumber: Joi.string().required(),
        password: Joi.string().min(8).max(255).required(),
        userName: Joi.string().min(5).max(20).required(),
    };
    return Joi.validate(user, schema);
}

function validateLogin(user) {
    const schema = {
        email: Joi.string().min(5).max(30).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(user, schema);
}

exports.validateSignup = validateSignup;
exports.validateLogin = validateLogin;