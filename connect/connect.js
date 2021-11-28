const Sequelize = require("sequelize");
const dbConfig = require('../config/db.config')

const sequelize = new Sequelize (
    dbConfig.database, dbConfig.user, dbConfig.password, {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
        define: {
            timestamps: false
        },
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

module.exports = sequelize;


