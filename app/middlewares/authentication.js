const passport = require('passport');
const passportJWT = require('passport-jwt');
var headerParser = require('header-parser');

const Student = require("../models/Student");
const InvalidToken = require("../models/InvalidToken");

const secretOrKey = '7QF7d5Bydj6cDF6Eckgh';
const extractJWT = passportJWT.ExtractJwt;
const JWTstrategy = passportJWT.Strategy;

const JWToptions = {
    jwtFromRequest: extractJWT.fromAuthHeader(),
    passReqToCallback: true,
    secretOrKey: secretOrKey
};

let strategy = new JWTstrategy(JWToptions, function (req, payload, next) {
    Student.findOne({
        _id: payload.id
    }, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(null, false, new Error('Input data is not correct'));
        }
        InvalidToken.findOne({
            token: headerParser(req.headers)
        }, function (err, token) {
            if (err) {
                return next(err);
            }
            if (token) {
                return next(null, false, new Error("Token passed is invalid"));
            }
            return next(null, user);
        });
    });
});

let auth = function (req, res, next) {
    passport.authenticate('jwt', {
        session: false
    }, function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({
                message: info.toString()
            });
        }
        req.user = user;
        return next();
    })(req, res, next);
};

module.exports = {
    strategy,
    auth
}