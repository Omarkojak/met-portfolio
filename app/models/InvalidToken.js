const mongoose = require('mongoose');

const InvalidTokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    }
});