const jwt = require('jsonwebtoken')
const _ =  require("pg/lib/native/query");

const keys = require("../config/jwt.js");

const Tokens = require('../models/token.js');
const User = require('../models/authModel.js')

class JwtService {
    constructor() {

    }
    /**
     * Метод для генерации рефреш токена
     * @returns {string}
     * */
    generateJwtRefresh() {
        const length = 64
        let result = "", seeds

        for(let i = 0; i < length - 1; i++){
            //Generate seeds array, that will be the bag from where randomly select generated char
            seeds = [
                Math.floor(Math.random() * 10) + 48,
                Math.floor(Math.random() * 25) + 65,
                Math.floor(Math.random() * 25) + 97
            ]

            //Choise randomly from seeds, convert to char and append to result
            result += String.fromCharCode(seeds[Math.floor(Math.random() * 3)])
        }

        return result
    }

    /**
     * @param candidate User
     * */
   async generateAndSaveJwt(c) {
        const token = jwt.sign(
            {
                login : c.candidate.login,
                id: c.candidate.id
            },
            keys.jwt,
            {
                expiresIn: 60*60*10000
            })

        const refToken = this.generateJwtRefresh()

        const tokenPair = new Tokens({
            userId: c.candidate.id,
            refreshToken: refToken,
            expirationDate: new Date(Date.now()+5*(1000*60)).toISOString(), // 5 минут = 5 * (1000 - милисекунды -> типа одна секунда, 60 - секунд в минуте)
        })

        await tokenPair.save()

        return {
            token: token,
            refreshToken: tokenPair.refreshToken,
        }
    }

    async refreshToken(rToken) {
        const token = await Tokens.findOne({where: {refreshToken: rToken}})
        const now = new Date(Date.now()).toISOString()
        if (token) {
            if (token.expirationDate < now) {
                const candidate = await User.findOne({where: {id: token.userId}})
                const newJwt = await this.generateAndSaveJwt(candidate)

                Tokens.destroy({where: {refreshToken: rToken}})
                return newJwt;
            }
        }
        return 401
    }
}

module.exports = new JwtService();

