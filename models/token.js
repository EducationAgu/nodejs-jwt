const sequelize = require('../connect/connect.js')
const {DataTypes} = require('sequelize')

const tokens = sequelize.define("tokens", {
    id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    expirationDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
})

module.exports = tokens;
