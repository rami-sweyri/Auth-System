const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const config = require('config');
const {validateSignup, validateLogin} = require('../validations/userValidations');
const User = require("../models/User");

const transport = nodemailer.createTransport(sendgridTransport({
  auth : {
    api_key : config.get('sendgridKey')
  }
}));

// user by request id
exports.me = async (req, res, next) => {
  await User.findById(req.user._id)
      .select('-password -verifyCode -verifyCodeExpiration')
      .exec()
      .then(user => {
          if (!user) return res.status(404).json({msg: 'user not found'});
          res.status(200).json({user: user, msg: 'User loader successfully'});
      })
      .catch(err => res.status(500).json({msg: err}));
};

// user login
exports.login = async (req, res, next) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json({msg: error.details[0].message});

  // let user = await User.find({ email: req.body.email });
  let user = await User.findOne({$or:[{email: req.body.email},{phoneNumber: req.body.phoneNumber}, {userName: req.body.userName}]});
  if (!user) return res.status(404).json({msg: 'This user not registered yet!'});
  console.log(user)
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({msg: 'Invalid email or password.'});

  const token = user.generateAuthToken();
  res.status(200).json({ token });
};


// register user
exports.register = async (req, res, next) => {
  const { error } = validateSignup(req.body);
  if (error) return res.status(400).json({msg: error.details[0].message});

  let user = await User.findOne({$or:[{email: req.body.email},{phoneNumber: req.body.phoneNumber}, {userName: req.body.userName}]});
  if (user) return res.status(400).json({msg: 'User already registered.'});

  user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const verifyCode = Math.floor(100000 + Math.random() * 900000);
  user.verifyCode = await verifyCode;
  user.verifyCodeExpiration = await Date.now() + 3600000;

  await user.save().then((result) => {
        res.status(200).json({msg: 'Successfully registered.'});
        return transport.sendMail({
          to: result.email,
          from: 'Yummy@gmail.com',
          subject: 'Successfully registered!',
          html: `
          <h1>You successfully signed up!</h1>
          <p>activation code YU-${verifyCode}</p>
            `
        });
  })
  .catch(err => res.status(400).json({msg:err}));
};

// verify by email
exports.verifyByCode = async (req, res, next) => {
  const verifyCode = req.body.verifyCode;
  const id = req.user._id;
  await User.findOne({_id: id}, async function (error, user) {
    if (error) { res.status(500).json({msg: error}) } 
    else {
      if (user) {
        if (user.verifyCode === verifyCode) {
          if (user.verifyCodeExpiration < Date.now()) {
            res.status(403).json({ msg: 'Verification code has expired.'});
          } else {
            user.emailVerified = await true;
            user.verifyCode = await undefined;
            user.verifyCodeExpiration = await undefined;
            await user.save();
            res.status(200).json({ msg: 'Verify was successfully verified.' });
          }
        } else {
          res.status(403).json({ msg: 'Invalid verification code'});
        }
      } else {
        res.status(400).json({ msg: 'There is no user with this ID.' });
      }
    }
  });
};

// send Verification to email
exports.sendVerificationEmail = async (req, res, next) => {
  const verifyCode = Math.floor(100000 + Math.random() * 900000);
  User.findOne({_id: req.user._id}, function (error, user) {
    if (error) {res.status(500).json({ msg: error });
    } else {
      if (user) {
        user.emailVerified = false;
        user.verifyCode = verifyCode;
        user.verifyCodeExpiration = Date.now() + 3600000;
        user.save().then(result => {
            transport.sendMail({
                to: result.email,
                from: 'Yummy@gmail.com',
                subject: 'Verify Verify!',
                html: `<h1>Please use the code below to verify your email in our mobile app.</h1> <br /> <p>activation code YU-${verifyCode}</p>`
            });
            res.status(200).json({ msg: 'We have sent a verification code to your email.' });
        })
      } else {
        res.status(401).json({msg: 'not allowed'});
      }
    }
  })
};