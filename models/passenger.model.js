
const Sequelize = require('sequelize');
const Flight = require('./flight.model');

const Passenger = sequelize.define('passenger', {
        id: {
            type: Sequelize.INTEGER, 
            primaryKey: true,
            autoIncrement: true
        },
        passenger_code: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        seat_number: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        mobile_number: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
        },
        flight_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Flights',
                key: 'id'
            }
        }
    }, {
    validate : {
        
    }
});

Passenger.sync({force: false }).then(() => {
        
    // Table created
    // return Airplane.create({
        //     name: 'jet Name Test',
        //     passenger_capacity: 40,
        //     airplane_type: 'Airplane type test'
        // });
});


Flight.hasMany(Passenger, {
    foreignKey: 'flight_id'
});
    
Passenger.belongsTo(Flight, {
    foreignKey: 'flight_id'
});
module.exports = async () => {
}

module.exports = Passenger;