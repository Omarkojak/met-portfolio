const bcrypt = require("bcrypt-nodejs");
const mongoose = require("mongoose");

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

const studentSchema = mongoose.Schema({
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

studentSchema.pre("save", function (done) {
    let student = this;
    if (!student.isModified("password")) {
        return done();
    }
    bcrypt.hash(student.password, null, null, function (err, hased_password) {
        if (err) {
            return done(err);
        }
        student.password = hased_password;
        return done();
    });
});

studentSchema.methods.checkPassword = function (guess, done) {
    bcrypt.compare(guess, this.password, function (err, isMatch) {
        if(err) {
            return done(err);
        }
        done(null, isMatch);
    });
};

studentSchema.methods.fullname = function () {
    return this.first_name + " " + this.last_name;
};

let Student = mongoose.model("Student", studentSchema);

module.exports = Student;