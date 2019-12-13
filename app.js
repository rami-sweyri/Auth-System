const config = require('config');
const mongoose = require('mongoose');
const express = require('express');

const app = express();

if (!config.get('jwtPrivateKey') || !config.get('mongoURI')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

// ----------- Database Connect -----------//
// mongoose.connect(config.get('mongoURI'), { 
//   useNewUrlParser: true, 
//   useCreateIndex: true,
//   useUnifiedTopology: true
 
//   })
//   .then(() => console.log('MongoDB  Connected'))
//   .catch(err => console.log(err));
  mongoose
  .connect(config.get('mongoURI'), { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
  
// ----------- Express body parser -----------//
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ----------- Uploads -----------//
app.use('/uploads', express.static('uploads'));



// ----------- Access Control -----------//
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-auth-token');
  next();
});


// ----------- User Routes -----------//
app.use("/api/auth", require('./src/routes/auth'));


// ----------- Server static assets -----------//
// app.use(express.static('client/build'));
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
// });


// ----------- ERRORS -----------//
app.use(function(req, res, next) {
  return res.status(404).send({ message: 'Route'+req.url+' Not found.!' });
});
// 500 - Any server error
app.use(function(err, req, res, next) {
  return res.status(500).send({ error: err });
});

const PORT = process.env.PORT || '4000';
app.listen(PORT, console.log(`Server started on port ${PORT}`));
