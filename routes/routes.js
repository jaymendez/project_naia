const express = require('express');
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth'); 
var airplaneController = require('../controllers/airplaneController');
var flightController = require('../controllers/flightController');
var luggageController = require('../controllers/luggageController');
var passengerController = require('../controllers/passengerController');
var userController = require('../controllers/userController');


var app = express();
var router = express.Router();
app.use(express.static('public'));



// router.get('/', airplaneController.test);

router.get('/home', ensureAuthenticated, (req, res) => {
    var hostname = req.headers.host;
    res.render('pages/home',{
        title: '',
        user: req.user
    });
});
router.get('/about', ensureAuthenticated, (req, res) => {
    var hostname = req.headers.host;
    res.render('pages/about',{title: ''})
});
/* Airplane Routes */
router.get('/airplane/create', ensureAuthenticated, (req, res) => {
    res.render('airplane/addOrEdit',{
        title: 'Add Airplanes',
        airplane: '',
        messages: ''
    });
});
router.post('/airplane/create', airplaneController.create);
router.get('/airplane',ensureAuthenticated, airplaneController.view);

router.get('/airplane/view', ensureAuthenticated, (req, res) => {
    res.render('airplane/listAirplanes');
});
router.get('/airplane/create/:id', ensureAuthenticated, airplaneController.update);
router.get('/airplane/create/:id', ensureAuthenticated, (req, res) => {
    res.render('airplane/addOrEdit',{
        title: 'Add Airplanes',
        airplane: '',
        messages : '',
    });
});
router.get('/airplane/delete/:id', ensureAuthenticated, airplaneController.delete);

/* Flight Routes */
router.get('/flight/create', ensureAuthenticated, (req, res) => {
    res.render('flight/addOrEdit',{
        title: 'Add Flight',
        formValues: '',
        messages: '',
    })
});
// router.get('/flight/create', flightController.getAvailableAirplane);
router.post('/flight/create', flightController.create);
router.get('/flight/getAvailableAirplane', ensureAuthenticated, flightController.getAvailableAirplane);
router.get('/flight', ensureAuthenticated, flightController.view);
router.get('/flight/view', ensureAuthenticated, (req, res) => {
    res.render('flight/listFlights');
});
router.post('/flight/simulateFlight', flightController.simulateFlight);

// router.get('/flight', flightController.view);


/* Seat Dashboard */
router.get('/flight/view/:id', ensureAuthenticated, flightController.getLuggageStatus);
router.get('/dashboard/:id', luggageController.viewDashboard);
// router.get('/dashboard/:id', (req,res) => {
//     res.render('luggage/viewLuggage');
// });
/* LUGGAGE */
router.get('/luggage/register', ensureAuthenticated, (req, res) => {
    res.render('luggage/createLuggage',{
        formValues: '',
        messages : ''
    });
});

router.get('/rfidScan', luggageController.updateLuggageStatus);
router.get('/getLuggageStatus', luggageController.getLuggageStatus);
router.get('/getLuggageCount', luggageController.getLuggageCount);
router.post('/luggage/register', luggageController.registerLuggage);
router.get('/luggage/details', luggageController.viewLuggageDetails);
router.get('/luggage/getPickedUp', luggageController.getPickedUp);
router.post('/flight/endSession', luggageController.endSession);



/* Passenger */
router.get('/passenger/register', ensureAuthenticated, (req, res) => {
    res.render('passenger/createPassenger',{
        title:'Register Passenger',
        formValues: '',
        messages : ''
    });
});
router.post('/passenger/register', passengerController.registerPassenger);


/* Users */
//Login page
router.get('/users/login', forwardAuthenticated, (req, res) => {
    res.render('users/login') 
});

//Register page
router.get('/users/register', forwardAuthenticated, (req, res) => {
    res.render('users/register') 
}); 
router.post('/users/register', userController.registerUser); 

// Login handle
router.post('/users/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login')
});

module.exports = router;