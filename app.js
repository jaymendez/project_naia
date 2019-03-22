const db = require('./models/db');

const express = require('express');
const path = require('path');
const router = require('./routes/routes');
const bodyparser = require('body-parser');
const url = require('url');

var app = express();
app.use(bodyparser.urlencoded({
    extended: true
}))
// app.use(express.logger('dev'));
app.use('/public',express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'public/images')));
app.use('/js',express.static(path.join(__dirname, 'public/js')));
app.use('/css',express.static(path.join(__dirname, 'public/css')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.listen(3000, () => {
    console.log('Server start at port 3000')
});

app.use('/', router);