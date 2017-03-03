const express = require("express");
const passport = require('passport');
const bodyParser = require('body-parser');
const headerParser = require('header-parser');
const flash = require("connect-flash");
const multer = require('multer');

const Student = require("./models/Student");
const Project = require("./models/Project");

const secretOrKey = '7QF7d5Bydj6cDF6Eckgh';

// // https://codeforgeek.com/2016/01/multiple-file-upload-node-js/
// var storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, './uploads');
//     },
//     filename: function (req, file, callback) {
//         callback(null, file.fieldname + '-' + Date.now());
//     }
// });
// var upload = multer({
//     storage: storage
// }).array('userPhoto', 1);


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
        req.flash('infos', 'You have signed up usccessfully please login');
        res.redirect('/login');
    });
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.post("/login", passport.authenticate("login", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }),function (req, res) {
        console.log("woho");
});

router.get("/logout", function (req, res) {
    console.log("la3eb");
    req.logout();
    res.redirect("/");
});

router.get('/portfolio', function (req, res) {
    Project.find({
        creator: req.user._id
    }, function (err, projects) {
        if (err) {
            return next(err);
        }
        res.render('portfolio', {
            projects: projects
        });
    });
});

// router.post('/portfolio', passport.authenticate("login", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true
// }), upload.single('portfolio-img'), function (req, res, next) {
//     let portfolioImage = req.file;
//     let name = '';
//     if (portfolioImage) {
//         name = portfolioImage.filename;
//     }
//     Student.findOne({
//         _id: req.user._id
//     }, function (err, user) {
//         if (err) {
//             return next(err);
//         }
//         if (user.profile_pic)
//             return next('Already you have a porfolio');
//         user.profile_pic = name;
//         user.save(function (err) {
//             if (err) {
//                 return next(err);
//             }
//             res.redirect('/portfolio', {
//                 info: "You have created your portfolio successfully"
//             });
//         });
//     });
// });


module.exports = router;