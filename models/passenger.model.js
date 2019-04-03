
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
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isNumeric: {
                    msg: 'Mobile Number needs to be numeric'
                },
                len: {
                    args: [0,12],
                    msg: 'Mobile number max of 12 digits'
                }  
            },
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
        emptyFields() {
            if (!this.passenger_code || !this.seat_number || !this.first_name || !this.last_name || !this.email || !this.mobile_number || !this.flight_id) {
                throw new Error('Please fill all the fields');
            }
        }
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