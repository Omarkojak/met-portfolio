const express = require("express");
const passport = require('passport');
const bodyParser = require('body-parser');
const headerParser = require('header-parser');
const flash = require("connect-flash");
const multer = require('multer');

const User = require("./models/User");
const Project = require("./models/Project");

const secretOrKey = '7QF7d5Bydj6cDF6Eckgh';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const buf = crypto.randomBytes(48);
        cb(null, Date.now() + buf.toString('hex') + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});


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

router.get("/", function (req, res) {
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
    let user = new User({
        first_name: first_name,
        last_name: last_name,
        email: email,
        username: username,
        password: password
    });
    console.log(password);
    user.save(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('info', 'You have signed up usccessfully please login');
        res.redirect('/login');
    });
}, passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
}));

router.get("/login", function (req, res) {
    res.render('login');
});

router.post('/login',
    passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

router.get("/logout", function (req, res) {
    console.log("la3eb");
    req.logout();
    res.redirect("/");
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("info", "You must be logged in to see this page.");
        res.redirect("/login");
    }
}

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


module.exports = router;