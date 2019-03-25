const express = require('express');
var airplaneController = require('../controllers/airplaneController');
var flightController = require('../controllers/flightController');
var luggageController = require('../controllers/luggageController');
var passengerController = require('../controllers/passengerController');

var app = express();
var router = express.Router();
app.use(express.static('public'));


router.get('/', airplaneController.test);

router.get('/home', (req, res) => {
    var hostname = req.headers.host;
    res.render('pages/home',{title: ''})
});
router.get('/aboutus', (req, res) => {
    var hostname = req.headers.host;
    res.render('pages/home',{title: ''})
});
/* Airplane Routes */
router.get('/airplane/create', (req, res) => {
    res.render('airplane/addOrEdit',{
        title: 'Add Airplane',
        airplane: ''
    });
});
router.post('/airplane/create', airplaneController.create);
router.get('/airplane', airplaneController.view);

router.get('/airplane/view', (req, res) => {
    res.render('airplane/listAirplanes');
});
router.get('/airplane/create/:id', airplaneController.update);
router.get('/airplane/delete/:id', airplaneController.delete);


/* Flight Routes */
router.get('/flight/create', (req, res) => {
    res.render('flight/addOrEdit',{
        title: 'Add Flight',
        flight: ''    
    })
});
// router.get('/flight/create', flightController.getAvailableAirplane);
router.post('/flight/create', flightController.create);
router.get('/flight/getAvailableAirplane', flightController.getAvailableAirplane);
router.get('/flight', flightController.view);
router.get('/flight/view', (req, res) => {
    res.render('flight/listFlights');
});
// router.get('/flight', flightController.view);


/* Seat Dashboard */
router.get('/flight/view/:id', flightController.getLuggageStatus);
router.get('/dashboard/:id', luggageController.viewDashboard);
// router.get('/dashboard/:id', (req,res) => {
//     res.render('luggage/viewLuggage');
// });
/* LUGGAGE */
router.get('/luggage/register', (req, res) => {
    res.render('luggage/createLuggage',{

    });
});

router.get('/rfidScan', luggageController.updateLuggageStatus);
router.get('/getLuggageStatus', luggageController.getLuggageStatus);
router.get('/getLuggageCount', luggageController.getLuggageCount);
router.post('/luggage/register', luggageController.registerLuggage);
router.get('/luggage/details', luggageController.viewLuggageDetails);


/* Passenger */
router.get('/passenger/register', (req, res) => {
    res.render('passenger/createPassenger',{
        title:'Register Passenger',
        airplane:''
    });
});
router.post('/passenger/register', passengerController.registerPassenger);

module.exports = router;