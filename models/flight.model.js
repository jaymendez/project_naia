const Sequelize = require('sequelize');
const Airplane = require('./airplane.model');

const Flight = sequelize.define('flight', {
    id: {
        type: Sequelize.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    flight_number: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    plan_starttime: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    plan_endtime: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    departure_time: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    arrival_time: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    airplane_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: 'Airplanes',
          key: 'id'
        }
    }
  }, {
      validate : {
          
      }
  });

  
Flight.sync({force: false}).then(() => {
      
      // Table created
      // return Airplane.create({
          //     name: 'jet Name Test',
          //     passenger_capacity: 40,
          //     airplane_type: 'Airplane type test'
          // });
});
        
Flight.associate = function(models) {
    // Using additional options like CASCADE etc for demonstration
    // Can also simply do Task.belongsTo(models.User);
}


module.exports = Flight;
