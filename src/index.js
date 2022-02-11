require("dotenv").config();

var app = require('express')();
const express = require("express");
var server = require('http').createServer(app);
const port = process.env.PORT || 8080;
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieSession = require('cookie-session');
const io = require("socket.io")(server, {
  cors: {
    origin: `http://localhost:${port}`,
    credentials: true,
  },
});


const { Pool } = require('pg');
const db = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect()
.then(() => console.log('db connected'))
.catch(err => console.error('db connection error', err.stack));

// database test
// const testQuery = `SELECT id, first_name FROM users`;
// db.query(testQuery)
//     .then((result) => {
//       console.log(result.rows);
//     })
//     .catch((err) => {
//       console.log(err.message)
//     })



app.use(cors({ origin: `http://localhost:${port}`, credentials: true }));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['this is the key', 'key2']
}));

// Now all routes & middleware will have access to req.io
// app.use((req, res, next) => {
//   req.io = io;
//   return next();
// });


//login
app.get('/login/:id', (req, res) => {
  req.session.user_id = req.params.id;
  console.log('login')
  res.redirect('/');
});


// using router
const test = require("./routes/test");

app.use("/test", test(db, io));

server.listen(port, function() {
  console.log(`Listening on http://localhost: ${port}`);
});

// module.exports = { db, io }