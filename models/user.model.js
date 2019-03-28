const Sequelize = require('sequelize');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
  }, {
      validate : {
          
      }
  });
  

User.sync({force: false}).then(() => {
    
    
    // Table created
    // return User.create({
    //     name: 'jet Name Test',
    //     email: 40,
    //     password: 'Airplane type test'
    // });
});
  
module.exports = User;
