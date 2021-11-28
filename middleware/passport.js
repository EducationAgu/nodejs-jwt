const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const keys = require('../config/jwt.js')

const User = require('../models/authModel.js')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.jwt
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, function(payload, done) {
            try {
                const user = User.findAll({id:payload.id}).select('login id')
                if (user) {
                    done(null, user)
                }
                else {
                    done(null, false)
                }
            }
            catch(e) {
            }
            
        })
    )
}
