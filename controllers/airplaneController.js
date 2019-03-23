const express = require('express');
const Flight = require('../models/flight.model');
const Airplane = require('../models/airplane.model');
const Passenger = require('../models/passenger.model');
const Luggage = require('../models/luggage.model');


module.exports.test = (req, res) => {
    res.json('test form controller');
};

module.exports.create = (req, res) => {
    if (req.body.id) {
         Airplane.update(req.body,{
             where : { 
                 id : req.body.id
             }
         })
         .then( airplane => {
            console.log(airplane);
            res.redirect('/airplane/view')
         });
    }
    else {
        Airplane.create(req.body)
        .then(airplane => {
            res.redirect('/home');
            // res.render('/home')
        });
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
        include: Flight
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
            airplane : airplane
        })
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