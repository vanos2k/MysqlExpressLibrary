const {Sequelize, DataTypes, Model} = require('sequelize');
const sequelize = require('../utils/database');

class User extends Model {}

User.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    image: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    tableName: 'user'
});


// status = 0-user 1-admin

module.exports = User;