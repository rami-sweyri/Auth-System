const config = require('config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

// Create Schema
const UserSchema = new Schema({
    email: {type: String, required: true, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
    password: {type: String, required: true},
    userName: {type: String, required: true},
    phoneNumber: {type: String, required: true, default: ''},
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