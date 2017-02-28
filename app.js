const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config()

const DB_Url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/miniproject';
const port = process.env.port || 5000;

const app = express();
mongoose.connect(DB_Url);

app.listen(port, function () {
    console.log(`Server Listening On Port ` + port);
});