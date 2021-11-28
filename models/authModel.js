const sequelize = require('../connect/connect.js')
const {DataTypes} = require('sequelize')


const user = sequelize.define("user", {

    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    
    login: {
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    
    password:{
        type:DataTypes.STRING,
        allowNull: false
    }
    
});


module.exports = user;
