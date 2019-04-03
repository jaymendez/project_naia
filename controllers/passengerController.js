const express = require('express');
const Flight = require('../models/flight.model');
const Airplane = require('../models/airplane.model');
const Passenger = require('../models/passenger.model');
const Luggage = require('../models/luggage.model');


module.exports.registerPassenger = (req, res) => {
    console.log(req.body);
    formValues = {};
    formValues.passenger_code = req.body.passenger_code;
    formValues.flight_number = req.body.flight_number;
    formValues.seat_number = req.body.seat_number;
    formValues.first_name = req.body.first_name;
    formValues.last_name = req.body.last_name;
    formValues.email = req.body.email;
    formValues.mobile_number = req.body.mobile_number;
    errors = [];
    errs = [];

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
        console.log('asd');
         
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
                    err.errors.forEach((el,i) => {
                        data = {};
                        data.field = el.path;
                        data.error = el.message;
                        errors.push(data)
                        errs.push(el.message);
                    });
                    res.render('passenger/createPassenger', {
                        title:'Register Passenger',
                        messages: errors,
                        formValues,
                    });
                });
            } else {
                console.log('asd');
                data = {}
                data.error = "Flight number doesn't exist";
                errors.push(data);
                res.render('passenger/createPassenger', {
                    title:'Register Passenger',
                    messages : errors,
                    formValues,
                });
            }
        }).catch((err) => {
            console.error("Error: ", err);
        });
        
    }
}