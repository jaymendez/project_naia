const db = require('./models/db');

const express = require('express');
const path = require('path');
const router = require('./routes/routes');
const bodyparser = require('body-parser');
const url = require('url');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator')

var app = express();

//Passport config
require('./config/passport')(passport);

//Body Parser
app.use(bodyparser.urlencoded({
    extended: true
}))

app.use(expressValidator());

//Cookie Parser
app.use(cookieParser());

//Express Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 3600000,
        sameSite: true,
        secure: false
    }
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//Connect Flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// app.use(express.logger('dev'));
app.use('/public',express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'public/images')));
app.use('/js',express.static(path.join(__dirname, 'public/js')));
app.use('/css',express.static(path.join(__dirname, 'public/css')));

// view engine setup
// app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.listen(3000, () => {
    console.log('Server start at port 3000')
});

//routes
app.use('/', router);

app.use(function(req, res, next){
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {
      res.render('error/404');
      return;
    }
  
   /*  // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }
   */
    // default to plain-text. send()
    // res.type('txt').send('Not found');
  });