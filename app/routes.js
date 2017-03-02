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
    Student.find()
        .sort({
            created_at: "descending"
        })
        .exec(function (err, students) {
            if (err) {
                return next(err);
            }
            res.render("index", {
                students: students
            });
        });
});

module.exports = router;