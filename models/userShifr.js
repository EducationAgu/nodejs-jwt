const sequelize = require('../connect/connect.js')
const {DataTypes} = require('sequelize')

const usershifr = sequelize.define("usershifr",
    {
        userid: {
            type:DataTypes.BIGINT,
            unique: true,
        },
        UIMapping: {
            type: DataTypes.JSONB,
        },
    });

module.exports = usershifr;
