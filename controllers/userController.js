const User = require('../models/user.model');
const bcrypt = require('bcryptjs');



module.exports.registerUser = (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({msg : 'Please fill in all fields'})
    }

    if (password !== password2) {
        errors.push({msg : 'Passwords do not match'})
    }

    if (password.length < 6) {
        errors.push({msg : 'Passwords should be atleast 6 characters'})
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({
            where: {email : email}
        }).then(user => {
            if (user) {
                errors.push({msg : 'Email is already registered'})
                res.render('users/register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        hashedPassword = hash;
                        const newUser = User.create({
                            name,
                            email,
                            password : hashedPassword
                        })
                        .then( user => {
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('/users/login');   
                        })
                        .catch(err => console.log(err));
                    })
                });
            }
        })
    }
}