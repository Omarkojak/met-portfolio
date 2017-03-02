const express = require("express");
const bodyParser = require('body-parser');
const headerParser = require('header-parser');
const jwt = require('jsonwebtoken');

const Student = require("./models/Student");
const InvalidToken = require("./models/InvalidToken");

const router = express.Router();
const secretOrKey = '7QF7d5Bydj6cDF6Eckgh';

router.use(bodyParser.json());

router.get("/", function (req, res, next) {
    res.render("index");
});

router.get("/signup", function (req, res) {
    res.render("signup");
});

router.post("/signup", function (req, res, next) {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    if (!first_name || !last_name || !email || !username || !password) {
        return next();
    }
    let student = new Student({
        first_name: first_name,
        last_name: last_name,
        email: email,
        username: username,
        password: password
    });
    student.save(function (err) {
        if (err) {
            return next(err);
        }
        return res.json({
            message: "You've singed up successfully"
        });
    });
});

router.get('login', function (req, res) {
    res.render('login');
});

router.post('/login', function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
        return next();
    }
    Student.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next('Invalid username');
        }
        user.checkPassword(password, function (err, isMatch) {
            if (err) {
                return next(err);
            }
            if (!isMatch) {
                return next('The password you entered is wrong');
            }
            let token = jwt.sign({
                id: user._id
            }, secretOrKey, {
                expiresIn: '5d'
            });

            return res.json({
                message: "Logged in successfully",
                token: token
            })
        })
    })
});

router.post('/logout', function (req, res, next) {
    let token = new InvalidToken({
        token: headerParser(req.headers)
    });
    token.save(function (err) {
        if (err) {
            return next(err);
        }
        return res.json({
            message: 'Logged Out Successfully'
        });
    });
});

module.exports = router;