const keys = require('../config/jwt.js')
const jwt = require('jsonwebtoken')
const User = require('../models/authModel.js')

module.exports = async function authentificate (req, res, next) {
    const auth = req.headers['authorization']
    if (auth) {
        if (auth){
            const tokPayload = jwt.verify(auth, keys.jwt)
            const user = await User.findOne({where: {id: tokPayload.id}})
            req.headers['user'] = user
            next()
            return
        }
    }
    res.status(401)
}

