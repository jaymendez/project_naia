const LocalStrategy = require('passport-local').Strategy;
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

//Load user model
const User = require('../models/user.model');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            //  Match user
            User.findOne({ 
                where: { email : email }
            })
            .then( user => {
                if (!user) {
                    return done(null, false, { message : 'That email is not registered' });
                }

                //  Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect'});
                    }
                });
            })
            .catch(err => console.log(err))
        })
    );
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findByPk(id)
        .then( user => {
            done(null, user);
        })
        .catch( err => done(err, user));
    });


}