const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    creator: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    comment: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    screenshots: [{
        type: String
    }],
    links: [{
        type: String
    }]
});

let Project = mongoose.model("Project", projectSchema);

module.exports = Project;