const Sequelize = require('sequelize');
const Flight = require('./flight.model');

const Airplane = sequelize.define('airplane', {
    id: {
        type: Sequelize.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    passenger_capacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    airplane_type: {
        type: Sequelize.STRING,
        allowNull: false,
    }
  }, {
      validate : {
          
      }
  });
  

Airplane.sync({force: false}).then(() => {
    
    
    // Table created
    // return Airplane.create({
    //     name: 'jet Name Test',
    //     passenger_capacity: 40,
    //     airplane_type: 'Airplane type test'
    // });
});

Airplane.associate = function(models) {
}
Airplane.hasMany(Flight, {
    foreignKey: 'airplane_id'
});

Flight.belongsTo(Airplane, {
    foreignKey: 'airplane_id'
});

module.exports = async () => {
}

module.exports = Airplane;
