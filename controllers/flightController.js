const express = require('express');
const moment = require('moment');
const Flight = require('../models/flight.model');
const Airplane = require('../models/airplane.model');


module.exports.test = (req, res) => {
    res.json('test form controller');
};

module.exports.create = (req, res) => {
    formValues = {};
    formValues.flight_number = req.body.flight_number;
    formValues.plan_starttime = req.body.plan_starttime;
    formValues.plan_endtime = req.body.plan_endtime;
    // formValues.airplane_id = req.body.airplane_id;
    errors = [];
    errs = [];

    console.log(req.body)
    if (req.body.id) {
        formValues.id = req.body.id;

         Airplane.update(req.body,{
             where : { 
                 id : req.body.id
             }
         })
         .then( airplane => {
            console.log(airplane);
            res.redirect('/airplane/view')
         })
         .catch( err => {
            err.errors.forEach((el,i) => {
                data = {};
                data.field = el.path;
                data.error = el.message;
                errors.push(data)
                errs.push(el.message);
            });
            res.render('flight/addOrEdit', {
                title: 'Update Flight',
                messages: errors,
                formValues,
            });
         });
    }
    else {
        Airplane.findOne({
            where: {name: req.body.airplane_id},
            raw: true
        })
        .then(airplane => {
            if (airplane) {
                req.body.airplane_id = airplane.id;
                Flight.create(req.body)
                .then(flight => {
                    res.redirect('/flight/view');
                    // res.render('/home')
                })
                .catch( err => {
                    err.errors.forEach((el,i) => {
                        data = {};
                        data.field = el.path;
                        data.error = el.message;
                        errors.push(data)
                        errs.push(el.message);
                    });
                    res.render('flight/addOrEdit', {
                        title: 'Add Flight',
                        messages: errors,
                        formValues,
                    });
                });
            } else {
                data = {}
                data.error = "Please pick an airplane";
                errors.push(data);
                res.render('flight/addOrEdit', {
                    title: 'Add Flight',
                    messages: errors,
                    formValues,
                });
            }
        })
    }
}

module.exports.view = async (req,res) => {
    // Airplane.hasMany(Flight, {
    //     foreignKey: 'airplane_id'
    // });
    // Flight.belongsTo(Airplane, {
    //     onDelete: "CASCADE",
    //     foreignKey: 'airplane_id'
    //   });
    
    let data = await Flight.findAll({
        // limit: 10,
        raw: true,
        include: [{
            model: Airplane,
            attributes: ['name', 'passenger_capacity', 'airplane_type'],
        }]
    }).catch( err => {
        console.error("Error: ",err);
    }).then( flight => {
        let returnData = []
        let airplane = {};
        console.log(flight);
        flight.forEach((element,key) => {
            var data = {airplane:{}};
            console.log(element.plan_starttime)
            data.id = element.id;
            data.flight_number = element.flight_number;
            // data.starttime = moment(new Date(element.plan_starttime).toISOString(), "YYYY-MM-DD HH:mm").format('MM/DD/YYYY HH:mm');
            // data.endtime = moment(new Date(element.plan_endtime).toISOString(), "YYYY-MM-DD HH:mm").format('MM/DD/YYYY HH:mm');
            // data.departure_time = element.departure_time ?  moment(element.departure_time, "YYYY-MM-DD HH:mm").format('MM/DD/YYYY HH:mm') : '';
            // data.arrival_time = element.arrival_time ? moment(element.arrival_time, "YYYY-MM-DD HH:mm").format('MM/DD/YYYY HH:mm') : '';
            
            data.starttime = moment(element.plan_starttime).format('MM/DD/YYYY HH:mm');
            data.endtime = moment(element.plan_endtime).format('MM/DD/YYYY HH:mm');
            data.departure_time = element.departure_time ? moment(element.departure_time).format('MM/DD/YYYY HH:mm') : '';
            data.arrival_time = element.arrival_time ? moment(element.arrival_time).format('MM/DD/YYYY HH:mm') : '';

            data.airplane.name = element['airplane.name'];
            data.airplane.passenger_capacity = element['airplane.passenger_capacity'];
            data.airplane.airplane_type = element['airplane.airplane_type'];
            returnData.push(data);
            console.log(data);
        })
        res.json(returnData);
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

module.exports.getAvailableAirplane = (req, res) => {
    let data = Airplane.findAll({
        // limit: 10,
        raw: true
    }).then( airplane => {
        // console.log(airplane)
        res.json({airplane:airplane});
    });
}

module.exports.getLuggageStatus = (req, res) => {

}