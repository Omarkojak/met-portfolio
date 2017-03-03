const mongoose = require('mongoose');

const portfolioSchema = mongoose.Schema({
    creator: {
        type: String,
        required: true,
        unique: true
    }
});

let Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;