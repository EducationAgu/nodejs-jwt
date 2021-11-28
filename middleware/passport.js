const keys = require('../config/jwt.js')
const jwt = require('jsonwebtoken')
const User = require('../models/authModel.js')

module.exports = function authentificate (req, res, next) {
    const auth = req.headers['authorization']
    const token = auth && auth.split(' ')[1]
    if (token){
        const tokPayload = jwt.verify(token, keys.jwt)
        next()
        return
    }
    res.sendStatus(401).json('Ошибка авторизации. Отсутствует токен для авторизации')
}

function findUser(tokPayload) {
    return User.findOne({where: {id: tokPayload.id}}).then(
        (user) => {
            return user
        })
}
