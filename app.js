const express = require('express');
const mongoose = require('mongoose');
const routes = require('./app/routes');
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

require('dotenv').config();

const DB_Url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/miniproject';
const port = process.env.port || 5000;

const app = express();

mongoose.connect(DB_Url);
app.set("port", port);

app.set("views", path.join(__dirname, "app/views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(session({
  secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
  resave: true,
  saveUninitialized: true
}));

app.use(flash());
app.use(routes);

app.use(function (err, req, res, next) {
  return res.status(500).json({
    message: err.toString()
  });
});

app.use(function (req, res, next) {
  return res.status(400).json({
    message: 'Invalid Or Missing Data'
  });
});

app.listen(port, function () {
  console.log(`Server Listening On Port ` + port);
});