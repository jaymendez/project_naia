const express = require('express');
const moment = require('moment');
const Flight = require('../models/flight.model');
const Airplane = require('../models/airplane.model');
const Passenger = require('../models/passenger.model');
const Luggage = require('../models/luggage.model')


module.exports.registerLuggage = (req, res) => {
    console.log(req.body);
    if (req.body.id) {
        Luggage.update(req.body,{
             where : { 
                 id : req.body.id
             }
         })
         .then( luggage => {
            console.log(luggage);
            res.redirect('/airplane/view')
         });
    }
    else {
        Passenger.findOne({
            where : {passenger_code : req.body.passenger_code},
            raw: true
        }).then( passenger => {
            if (passenger) {
                req.body.passenger_id = passenger.id;
                if (passenger) {
                    Flight.findOne({
                        where : {flight_number : req.body.flight_number},
                        raw: true
                    }).then(flight => {
                        if (flight) {
                            req.body.flight_id = flight.id;
                            
                            Luggage.create(req.body)
                            .then( luggage => {
                                res.redirect('/home');
                                // res.render('/home')
                            });
                        }
                    }).catch((err) => {
                        console.error("Flight Query Error: ", err);
                    });
                }
            }
        }).catch((err) => {
            console.error("Passenger Query Error: ", err);
        });

        
    }
}

module.exports.getLuggageStatus = (req, res) => {
    /*  
        Mag papasa tayo dito syempre ng Flight number,
        Where yung luggage ay nakapag depart.
        
        
    */
}

module.exports.updateLuggageStatus = (req, res) => {
    /* 
        Dito papasok if na tatap yung luggage sa carousel. 
    */
}

module.exports.viewDashboard = (req, res) => {
    Flight.findOne({
        where: { id : req.params.id },
        raw: true,
        include : [{
            model: Airplane,
            attributes: ['id','name', 'passenger_capacity', 'airplane_type'],
        }]
    }).then( flight => {
        if (flight) {
            // console.log(flight['airplane.id']);
            Airplane.findOne({
                where: {id : flight.airplane_id},
                raw: true
            }).then( airplane => {
                // console.log(airplane)
                res.render('luggage/viewLuggage',{
                    // title: 'Update Airplane',
                    airplane : airplane,
                    flight : flight
                })
            });
        } else {
            //render no page available.
            // res.render('');
        }
    })
}

module.exports.viewLuggageDetails = (req, res) => {
    const flightId = req.query.flight_id;
    // Flight.findAll({
    //     where: { id : flightId },
    //     raw: true,
    //     include : [{
    //         model: Luggage,
    //         // attributes: ['id','name', 'passenger_capacity', 'airplane_type'],
    //     }]
    // }).then( flight => {
    //     console.log(flight);
    // })
    Luggage.findAll({
        where: { flight_id : flightId },
        raw: true,
        include: [{
            model: Passenger
        }]
    }).then( luggage => {
        if (luggage) {
            var resultData = [];
            luggage.forEach((el, i) => {
                var data = {};
                data.name = el['passenger.first_name'] + " " + el['passenger.last_name'];
                data.arrival_time = el.arrival_time ? moment(el.arrival_time, "YYYY-MM-DD HH:mm").format('MM/DD/YYYY HH:mm') : '';
                data.departure_time = el.departure_time ?  moment(el.departure_time, "YYYY-MM-DD HH:mm").format('MM/DD/YYYY HH:mm') : '';
                resultData.push(data);
            });
            res.json({data : resultData});
        }
    });
}