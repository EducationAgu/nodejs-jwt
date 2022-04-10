const sequelize = require('../connect/connect.js')
const {DataTypes} = require('sequelize')

const Favorite = sequelize.define("favorite", {
    userid: {
        type:DataTypes.BIGINT,
            allowNull: false,
            references: { model: 'users', key: 'id' }
    },
    postid: {
        type:DataTypes.BIGINT,
        allowNull: false,
        references: { model: 'posts', key: 'id' }
    }
})

module.exports = Favorite;
