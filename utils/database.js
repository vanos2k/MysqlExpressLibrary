const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('library', 'root', 'newrootpassword', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;