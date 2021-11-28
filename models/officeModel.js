const sequelize = require('../connect/connect.js')
const {DataTypes} = require('sequelize')

const office = sequelize.define("office", {

    id:{
        type:DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },

    name:{
        type:DataTypes.STRING,
        allowNull: false
    }

});


module.exports = office;


