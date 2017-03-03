const express = require("express");
const passport = require('passport');
const bodyParser = require('body-parser');
const headerParser = require('header-parser');
const flash = require("connect-flash");
const multer = require('multer');
const CONSTANTS = require('./util/constants');

const User = require("./models/User");
const Project = require("./models/Project");
const Portfolio = require("./models/Portfolio");

const ejs = require('ejs');

const secretOrKey = '7QF7d5Bydj6cDF6Eckgh';

const IMAGE_TYPES = CONSTANTS.IMAGE_TYPES;

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callBack) {
            return callBack(null, `public/portfolio/`);
        },
        filename: function (req, file, callBack) {
            return callBack(null, `${req.user._id}_${Date.now()}.${file.mimetype.split('/')[1]}`);
        }
    }),
    fileFilter: function (req, file, callBack) {
        if (IMAGE_TYPES.includes(file.mimetype.split('/')[1]))
            return callBack(null, true);
        return callBack(new Error(`Invalid File Type. File type must be ${IMAGE_TYPES.toString()}!`));
    }
});


const router = express.Router();

router.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

router.get("/", function (req, res, next) {
    res.render(ejs.render("index"));
});

router.get("/", function (req, res) {
    res.render(ejs.render("index"));
});

router.get("/signup", function (req, res) {
    res.render(ejs.render("signup"));
});

router.post("/signup", upload.single('img'), function (req, res, next) {
    let img = req.file;
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
        password: password,
        profile_pic: img ? img.filename : "unknown1.png"
    });
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
    res.render(ejs.render('login'));
});

router.post('/login',
    passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

router.get("/logout", function (req, res) {
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

router.get('portfolio/:username', function (req, res) {
    console.log("hello");
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
        .exec(function (err, projects) {
            if (err) {
                projects = [];
            }
            res.render("portfolio", {
                projects: projects,
                user: user
            });
        });
});

router.get('/portfolio/new/:username', ensureAuthenticated, function (req, res) {
    return render('addProject');
});

router.post('/portfolio/new/:username', ensureAuthenticated, upload.single('img'), function (req, res) {
    let img = req.file;
    let link = req.body.link;
    let username = req.params.username;
    if (!img && !link) {
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
    project.save(function (err) {
        if (err) {
            return next(err);
        }
        let portfolio = Portfolio.findOne({
            creator: username
        }, function (portfolio, err) {
            if (err) {
                return next(err);
            }
            if (!portfolio) {
                let save = new Portfolio({
                    creator: username
                });
                save.save();
            }
        });
        req.flash("Project added sucessfully");
        res.redirect('/portfolio/:username');
    })
});

router.get('summary/:page', function (req, res) {
    let total = [];
    Portfolio.find(function (portfolios, err) {
        if (err) {
            return next(err);
        }
        let page = req.params.page;
        let start = 10 * (paage - 1) - 1;
        for (var i = 0; i < 10; i++ && start < portfolios.length, start++) {
            Project.find({
                createdBy: portfolios[i].creator
            }).sort({
                createdAt: "ascending"
            }).limit(2).exec(function (err, projects) {
                if (err) {
                    return next(err);
                }
                total.push(portfolios[i].creator);
                total.push(projects[0].name);
                total.push(projects[1].name);
            })
        }
    })
    res.render("summary", {
        total: total,
    });
});

module.exports = router;