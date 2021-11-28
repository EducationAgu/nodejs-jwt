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
        new JwtStrategy(options, async (payload, done) => {
            try {
                console.log(-1)
                const user = await User.findAll({id:payload.id}).select('login id')
                console.log(0)
                if (user) {
                    done(null, user)
                    console.log(1)
                }
                else {
                    done(null, false)
                    console.log(2)
                }
            }
            catch(e) {
                console.log(e)
                console.log(3)
            }
            
        })
    )
}