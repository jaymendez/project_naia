const express = require('express');
const moment = require('moment');
const Moment = require('moment-timezone');
const Flight = require('../models/flight.model');
const Airplane = require('../models/airplane.model');
const Passenger = require('../models/passenger.model');
const Luggage = require('../models/luggage.model')


moment.tz.setDefault("Asia/Manila");
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
            raw: true,
            include : [
                {
                    model: Flight,
                    attributes: ['id']
                },
            ]
        }).then( passenger => {
            if (passenger) {
                req.body.passenger_id = passenger.id;
                req.body.flight_id = passenger['flight.id'];
                console.log(req.body);
                Luggage.create(req.body)
                .then( luggage => {
                    res.redirect('/home');
                    console.log(luggage);
                    // res.render('/home')
                });
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
    const flightId = req.query.flightId;
    Luggage.findAll({
        where: {flight_id : flightId},
        raw: true,
        include: [Passenger]
    }).then( luggage => {
        resultData = [];
        console.log(luggage);
        var defaultVal = '1111-11-11 11:11:11';
        luggage.forEach((el, i) => {
            data = {}
            
            arrival_time = el.arrival_time;
            departure_time = el.departure_time;
            if (arrival_time !=  defaultVal && departure_time === defaultVal) {
                //arrived
                data.seat_number = el['passenger.seat_number'];
                data.status = 'arrived';
            }

            if (arrival_time === defaultVal && departure_time === defaultVal) {
                //delayed or not yet arrived
                data.seat_number = el['passenger.seat_number'];
                data.status = 'delayed';

            }

            if (arrival_time != defaultVal && departure_time != defaultVal) {
                //picked up
                data.seat_number = el['passenger.seat_number'];
                data.status = 'pickedUp';
            }
            resultData.push(data);
        })
        res.json({
            resultData : resultData
        });
    });

}

module.exports.updateLuggageStatus = (req, res) => {
    /* 
        Dito papasok if na tatap yung luggage sa carousel. 
    */
    //Receives RFID
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
    const rfid = req.query.rfid;
    console.log(rfid);
    Luggage.findOne({
        where: { rfid_uid : rfid},
        raw: true,
        include : Passenger
    }).then( luggage => {
        console.log(luggage);
        seat_number = luggage['passenger.seat_number'];
        // arrival_time = moment(new Date(luggage.arrival_time).toISOString(), "YYYY-MM-DD HH:mm:ss").format('YYYY-MM-DD HH:mm:ss');
        // departure_time = moment(new Date(luggage.departure_time).toISOString(), "YYYY-MM-DD HH:mm:ss").format('YYYY-MM-DD HH:mm:ss');
        arrival_time = luggage.arrival_time; 
        console.log(arrival_time);
        departure_time = luggage.departure_time; 
        req.body.arrival_time = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(req.body);
        console.log(arrival_time);
        if (arrival_time === '1111-11-11 11:11:11') {
            //no time in
            Luggage.update(req.body,{
                where : { 
                    id : luggage.id
                }
            })
            .then( data => {
                console.log(data);
                res.json({
                    seat_number : seat_number,
                });
            });
        } else {
            //do nothing as of now.
        }
        
        
    });
}

module.exports.viewDashboard = (req, res) => {
    Flight.findAll({
        where: { id : req.params.id },
        raw: true,
        include : [
            {
                model: Airplane,
                attributes: ['id','name', 'passenger_capacity', 'airplane_type'],
            },
            {
                model: Luggage,
                include : [Passenger]
            }
        ]
    }).then( flight => {
        if (flight) {
            // console.log(flight['airplane.id']);
            resultData = {luggage:[]};
            // console.log(resultData);
            flight.forEach((el , i) => {
                data = {};
                resultData.flight_id = el.id;
                resultData.flight_number = el.flight_number;

                // resultData.starttime = moment(new Date(el.plan_starttime).toISOString(), "YYYY-MM-DD HH:mm").format('MM/DD/YYYY HH:mm');
                // resultData.endtime = moment(new Date(el.plan_endtime).toISOString(), "YYYY-MM-DD HH:mm").format('MM/DD/YYYY HH:mm');
                // resultData.departure_time = el.departure_time ?  moment(el.departure_time, "YYYY-MM-DD HH:mm").format('MM/DD/YYYY HH:mm') : '';
                // resultData.arrival_time = el.arrival_time ? moment(el.arrival_time, "YYYY-MM-DD HH:mm").format('MM/DD/YYYY HH:mm') : '';
                resultData.starttime = moment(el.plan_starttime).format('MM/DD/YYYY HH:mm');
                resultData.endtime = moment(el.plan_endtime).format('MM/DD/YYYY HH:mm');
                resultData.departure_time = el.departure_time ? moment(el.departure_time).format('MM/DD/YYYY HH:mm') : '';
                resultData.arrival_time = el.arrival_time ? moment(el.arrival_time).format('MM/DD/YYYY HH:mm') : '';

                resultData.airplane_id = el['airplane.id'];
                resultData.airplane_name = el['airplane.name'];
                resultData.passenger_capacity = el['airplane.passenger_capacity'];
                resultData.airplane_type = el['airplane.airplane_type'];
                data.luggage_id = el['luggage.id'];
                data.rfid_uid = el['luggage.rfid_uid'];
                data.passenger_id = el['luggage.passenger_id'];
                data.departure_time = el['luggage.departure_time'];
                data.arrival_time = el['luggage.arrival_time'];
                data.weight = el['luggage.weight'];
                data.passenger_name = el['luggage.passenger.last_name'] + ', ' + el['luggage.passenger.first_name'];
                data.seat_number = el['luggage.passenger.seat_number'];
                data.mobile_number = el['luggage.passenger.mobile_number'];
                data.passenger_code = el['luggage.passenger.passenger_code'];
                resultData['luggage'].push(data);
            });
            res.render('luggage/viewLuggage',{
                // title: 'Update Airplane',
                resultData : resultData,
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
        include: [
            {
                model: Passenger
            },
        ]
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