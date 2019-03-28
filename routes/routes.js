const express = require('express');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth'); 
var airplaneController = require('../controllers/airplaneController');
var flightController = require('../controllers/flightController');
var luggageController = require('../controllers/luggageController');
var passengerController = require('../controllers/passengerController');
var userController = require('../controllers/userController');


var app = express();
var router = express.Router();
app.use(express.static('public'));

/* Users */
//Login page
router.get('/users/login', (req, res) => {
    res.render('users/login') 
});

//Register page
router.get('/users/register', (req, res) => {
    res.render('users/register') 
}); 
router.post('/users/register', userController.registerUser); 

// router.get('/', airplaneController.test);

router.get('/home', ensureAuthenticated, (req, res) => {
    var hostname = req.headers.host;
    res.render('pages/home',{
        title: '',
        user: req.user
    });
});
router.get('/aboutus', ensureAuthenticated, (req, res) => {
    var hostname = req.headers.host;
    res.render('pages/home',{title: ''})
});
/* Airplane Routes */
router.get('/airplane/create', ensureAuthenticated, (req, res) => {
    res.render('airplane/addOrEdit',{
        title: 'Add Airplane',
        airplane: ''
    });
});
router.post('/airplane/create', ensureAuthenticated, airplaneController.create);
router.get('/airplane', airplaneController.view);

router.get('/airplane/view', ensureAuthenticated, (req, res) => {
    res.render('airplane/listAirplanes');
});
router.get('/airplane/create/:id', ensureAuthenticated, airplaneController.update);
router.get('/airplane/delete/:id', ensureAuthenticated, airplaneController.delete);


/* Flight Routes */
router.get('/flight/create', (req, res) => {
    res.render('flight/addOrEdit',{
        title: 'Add Flight',
        flight: ''    
    })
});
// router.get('/flight/create', flightController.getAvailableAirplane);
router.post('/flight/create', ensureAuthenticated, flightController.create);
router.get('/flight/getAvailableAirplane', ensureAuthenticated, flightController.getAvailableAirplane);
router.get('/flight', ensureAuthenticated, flightController.view);
router.get('/flight/view', ensureAuthenticated, (req, res) => {
    res.render('flight/listFlights');
});
// router.get('/flight', flightController.view);


/* Seat Dashboard */
router.get('/flight/view/:id', ensureAuthenticated, flightController.getLuggageStatus);
router.get('/dashboard/:id', ensureAuthenticated, luggageController.viewDashboard);
// router.get('/dashboard/:id', (req,res) => {
//     res.render('luggage/viewLuggage');
// });
/* LUGGAGE */
router.get('/luggage/register', ensureAuthenticated, (req, res) => {
    res.render('luggage/createLuggage',{

    });
});

router.get('/rfidScan', ensureAuthenticated, luggageController.updateLuggageStatus);
router.get('/getLuggageStatus', ensureAuthenticated, luggageController.getLuggageStatus);
router.get('/getLuggageCount', ensureAuthenticated, luggageController.getLuggageCount);
router.post('/luggage/register', ensureAuthenticated, luggageController.registerLuggage);
router.get('/luggage/details', ensureAuthenticated, luggageController.viewLuggageDetails);


/* Passenger */
router.get('/passenger/register', ensureAuthenticated, (req, res) => {
    res.render('passenger/createPassenger',{
        title:'Register Passenger',
        airplane:''
    });
});
router.post('/passenger/register', ensureAuthenticated, passengerController.registerPassenger);


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