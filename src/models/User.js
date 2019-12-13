const config = require('config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

// Create Schema
const UserSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    userName: {type: String, required: true, unique: true},
    phoneNumber: {type: String, required: true, unique: true},
    emailVerified: {type: Boolean, default: false},
    verifyCodeExpiration: Date,
    verifyCode: String,
    resetCodeExpiration: Date,
    resetCode: String
});


UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
  return token;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;