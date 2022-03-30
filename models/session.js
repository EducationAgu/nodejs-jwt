const sequelize = require('../connect/connect.js')
const {DataTypes} = require('sequelize')

const Session = sequelize.define("session", {
    user_id: {
        type: DataTypes.BIGINT,
    },
    amount: {
        type: DataTypes.BIGINT,
    },
    lastReq: {
        type: DataTypes.DATE,
    }
})

module.exports = Session;
