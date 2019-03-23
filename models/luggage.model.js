const Sequelize = require('sequelize');
const Passenger = require('./passenger.model');
const Flight = require('./flight.model');

const Luggage = sequelize.define('luggage', {
    id: {
        type: Sequelize.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    rfid_uid: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    passenger_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Passengers',
          key: 'id'
        }
    },
    flight_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Flights',
          key: 'id'
        }
    },
    departure_time: {
        type: Sequelize.DATE,
        allowNull: true,
        // defaultValue: '1111-11-11 11:11:11',
    },
    arrival_time: {
        type: Sequelize.DATE,
        allowNull: true,
        // defaultValue: '1111-11-11 11:11:11',
    },
    weight: {
        type: Sequelize.INTEGER,
        allowNull: true,
    }
  }, {
      validate : {
          
      }
});

Luggage.sync({force: false}).then(() => {
      
    // Table created
    // return Airplane.create({
        //     name: 'jet Name Test',
        //     passenger_capacity: 40,
        //     airplane_type: 'Airplane type test'
        // });
});


Passenger.hasMany(Luggage, {
    foreignKey: 'passenger_id'
});

Luggage.belongsTo(Passenger, {
    foreignKey: 'passenger_id'
});

Flight.hasMany(Luggage, {
    foreignKey: 'flight_id'
});

Luggage.belongsTo(Flight, {
    foreignKey: 'flight_id'
});
module.exports = async () => {
}

module.exports = Luggage;