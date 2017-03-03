const bcrypt = require("bcrypt-nodejs");
const mongoose = require("mongoose");

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type : String,
        required : true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (password) {
                return PASSWORD_REGEX.test(password);
            },
            message: 'The password must be atleast 8 characters and should have at least one digit, and one special character'
        }
    },
    profile_pic: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre("save", function (done) {
    let user = this;
    if (!user.isModified("password")) {
        return done();
    }
    bcrypt.hash(user.password, null, null, function (err, hased_password) {
        if (err) {
            return done(err);
        }
        user.password = hased_password;
        return done();
    });
});

userSchema.methods.checkPassword = function (guess, done) {
    bcrypt.compare(guess, this.password, function (err, isMatch) {
        if(err) {
            return done(err);
        }
        done(null, isMatch);
    });
};

userSchema.methods.fullname = function () {
    return this.first_name + " " + this.last_name;
};

let User = mongoose.model("User", userSchema);

module.exports = User;