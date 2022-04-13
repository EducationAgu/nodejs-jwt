const sequelize = require('../connect/connect.js')
const {DataTypes} = require('sequelize')

const Comment = sequelize.define("comment", {
    user_id: {
        type: DataTypes.BIGINT,
    },
    content: {
        type: DataTypes.STRING,
    }
})

module.exports = Comment;
