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

router.post("/signup", upload.single('img'), function (req, res, next) {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let img = req.file;

    if (!first_name || !last_name || !email || !username || !password) {
        return next();
    }
    let user = new User({
        first_name: first_name,
        last_name: last_name,
        email: email,
        username: username,
        password: password,
        profile_pic: img ? img.filename : "unknown1.png"
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

router.get('/:username/portfolio', ensureAuthenticated, function (req, res) {
    const username = req.params.username;
    User.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next();
        }
    });
    Projects.findOne({
            creator: username
        }).sort({
            createdAt: "descending"
        })
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }
            res.render("profile", {
                projects: projects,
                user: user
            });
        });
});

router.get('/:username/portfolio/new', ensureAuthenticated,function (req, res) {
    return render('addProject');
});

router.post('/:username/portfolio/new', ensureAuthenticated,upload.single('img'), function (req, res) {
    let link = req.body.link;
    let img = req.file;
    let username = req.params.username;
    if(!img && !link){
        req.flash('error', 'You must provide wither a link or an image or both');
        res.redirect('/:username/portfolio/new');
    }
    let name = req.body.name;
    let comment = req.body.comments;

    let project = new Project({
        creator: username,
        name: name,
        comment: comment,
        screenshots: img.filename,
        links: link
    });
    project.save(function(err){
        if(err){
            return next(err);
        }
        req.flash("Project added sucessfully");
        res.redirect('/:username/portfolio');
    })
});


module.exports = router;