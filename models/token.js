const sequelize = require('../connect/connect.js')
const {DataTypes} = require('sequelize')

const tokens = sequelize.define("post", {
    jwtToken: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    expirationDate: {
        type: DataTypes.TIME,
        allowNull: false
    }
})

module.exports = tokens;
