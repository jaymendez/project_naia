const express = require('express');
const Flight = require('../models/flight.model');
const Airplane = require('../models/airplane.model');
const Passenger = require('../models/passenger.model');
const Luggage = require('../models/luggage.model')


module.exports.registerPassenger = (req, res) => {
    console.log(req.body);
    if (req.body.id) {
         Airplane.update(req.body,{
             where : { 
                 id : req.body.id
             }
         })
         .then( airplane => {
            console.log(airplane);
            res.redirect('/airplane/view')
         }).catch((err) => {
            console.error("Error: ", err);

        });
    }
    else {
        if (req.body.flight_number) {
            Flight.findOne({
                where : {flight_number : req.body.flight_number},
                raw: true
            }).then(flight => {
                if (flight) {
                    req.body.flight_id = flight.id;
                    Passenger.create(req.body)
                    .then(airplane => {
                        res.redirect('/home');
                        // res.render('/home')
                    }).catch((err) => {
                        console.error("Error: ", err);
                    });
                }
            }).catch((err) => {
                console.error("Error: ", err);
            });
        }
    }
}