const express = require('express');
const Flight = require('../models/flight.model');
const Airplane = require('../models/airplane.model');
const Passenger = require('../models/passenger.model');
const Luggage = require('../models/luggage.model');


module.exports.test = (req, res) => {
    res.json('test form controller');
};
/* 
module.exports.validate = (method) => {
    switch (method) {
        case 'create' : {
            return [
                body('passenger_capacity')
            ]
        }
    }
} */

module.exports.create = (req, res) => {
    if (req.method === "POST" || req.method === "PUT") {
        var airplane = {};
        airplane.name = req.body.name;
        airplane.passenger_capacity = req.body.passenger_capacity;
        airplane.airplane_type = req.body.airplane_type;
        errors = [];
        errs = [];

        if (req.body.id) {
            airplane.id = req.body.id;
            Airplane.update(req.body,{
                where : { 
                    id : req.body.id
                }
            })
            .then( airplane => {
                console.log(airplane);
                res.redirect('/airplane/view');
            })
            .catch(err => {
                err.errors.forEach((el,i) => {
                    data = {};
                    data.field = el.path;
                    data.error = el.message;
                    errors.push(data)
                    errs.push(el.message);
                });
                res.render('airplane/addOrEdit', {
                    title: 'Update Airplane',
                    airplane : airplane,
                    messages: errors,
                });
            });
        }
        else {
            if (req.body) {
                Airplane.create(req.body)
                .then(airplane => {
                    console.log(airplane);
                    res.redirect('/airplane/view');
                    // res.render('/home')
                }).catch(err => {
                    err.errors.forEach((el,i) => {
                        data = {};
                        data.field = el.path;
                        data.error = el.message;
                        errors.push(data)
                        errs.push(el.message);
                    });
                    // req.flash('error_msg', errs);
                    // req.flash('form_values', airplane);
                    // res.redirect('/airplane/create');
                    res.render('airplane/addOrEdit', {
                        title: 'Add Airplane',
                        airplane : airplane,
                        messages: errors,
                    });
                    
                });
            }
        }
    }
}

module.exports.view = async (req,res) => {
    
    // const passenger = await Passenger.findAll({ raw: true, include : Flight})
    // .catch(err => {
    //     console.error("Error: ",err);
    // })
    // .then( ret => {
    //     res.json({ret:ret});
    // });

    // const luggage = await Luggage.findAll({ raw: true, include : [Flight, Passenger]})
    // .catch(err => {
    //     console.error("Error: ",err);
    // })
    // .then( ret => {
    //     res.json({ret:ret});
    // });

    let data = await Airplane.findAll({
        // limit: 10,
        raw: true,
    }).catch( err => {
        console.error("Error: ", err);
    }).then( airplane => {
        // console.log(airplane)
        res.json({airplane:airplane});
        // res.render('airplane/airplanesjson',{airplane: airplane});
    });
    // console.log(data)
}

module.exports.update = (req,res) => {
    Airplane.findOne({
        where : {id : req.params.id},
        raw: true
    }).then(airplane => {
        console.log(airplane)
        res.render('airplane/addOrEdit',{
            title: 'Update Airplane',
            airplane : airplane,
            messages : ''
        });
    })
}

module.exports.delete = (req,res) => {
    if (req.params.id) {

        Airplane.destroy({
            where : {
                id : req.params.id
            }
        })
        .then( airplane => {
            res.redirect('/airplane/view');
        })
    }
}