const express = require("express");
const Student = require("./models/Student");

const router = express.Router();

router.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

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
    console.log(req.body.first_name);
    if (!first_name || !last_name || !email || !username || !password) {
        console.log(first_name + " " + last_name + " " + email + " " + username + " " + password);
        console.log("nooooooooo1");
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
            console.log("nooooooooo2");
            return next(err);
        }
        return res.json({
            message: "You've singed up successfully"
        });
    });
});

module.exports = router;