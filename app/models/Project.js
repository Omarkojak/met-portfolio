const mongoose = require('mongoose');

const Project = mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        unique: true
    },
    name:{
        type: String
    },
    comment: {
        type: String
    },
    screenshots: [{
        type: String
    }],
    links: [{
        type: String
    }]
});