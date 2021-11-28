const jwt = require('jsonwebtoken')
const keys = require("../config/jwt.js");

const Tokens = require('../models/token.js');
const connect = require('../connect/connect.js')


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
     * @returns Tokens
     * */
    generateAndSaveJwt(candidate) {
        const token = jwt.sign(
            {
                login : candidate.login,
                id: candidate.id
            },
            keys.jwt,
            {
                expiresIn: 60*60
            })

        const refToken = this.generateJwtRefresh()

        const tokenPair = new Tokens({
            jwtToken: token,
            refreshToken: refToken,
            expirationDate: new Date(Date.now()+5*(1000*60)), // 5 минут = 5 * (1000 - милисекунды -> типа одна секунда, 60 - секунд в минуте)
        })

        tokenPair.save()
        return tokenPair
    }
}

module.exports = new JwtService();

