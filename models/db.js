const Sequelize = require('sequelize');
var configDB = require('../config/database');


/* Sequelize Configuration */
const sequelize = new Sequelize(configDB.mysql.database, configDB.mysql.user, configDB.mysql.password, {
    host : configDB.mysql.host,
    dialect: 'mysql',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

sequelize.authenticate()
.then(() => {
    console.log('CONNECTION ESTABLISHED');
})
.catch(err => {
    console.error('unable to connect to db: ', err);
});

global.sequelize = sequelize;

require('./airplane.model');
require('./flight.model');
require('./passenger.model');
require('./luggage.model');
require('./bootstrap.js');