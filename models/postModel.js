const sequelize = require('../connect/connect.js')
const {DataTypes} = require('sequelize')
const User = require('./authModel')

const post = sequelize.define("post", {

    id:{
        type:DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },

    name:{
        type:DataTypes.STRING,
        allowNull: false
    },

    userid: {
        type:DataTypes.BIGINT,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    }
});

module.exports = post;


