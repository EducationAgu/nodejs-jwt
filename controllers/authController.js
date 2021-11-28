const bcrypt = require('bcryptjs');

const connect = require('../connect/connect.js')

const JWTS = require('../sevices/jwtService.js')
const rsa = require('../sevices/rsaService.js')

const User = require('../models/authModel.js')

const keys = require('../config/jwt.js')

const errorHandler = require('../utils/errorHandler.js')

class authController {

    async login(req, res) {

        if (!req.body.login || !req.body.password) {
            res.status(400).json({
                message: "Неверный формат данных"
            })
        }
        try {
            req.body.password = rsa.decrypt(req.body.password)
        } catch (e) {
            errorHandler(res, e)
        }

        const candidate = await User.findOne({where: {login: req.body.login}})
        if (candidate) {
            if (bcrypt.compareSync(req.body.password, candidate.password)) {
                try {
                    const tokens = JWTS.generateAndSaveJwt({candidate})
                    res.status(200).json({
                        token: tokens.jwtToken,
                        refreshToken: tokens.refreshToken,
                    })
                } catch (e) {
                    errorHandler(res, e)
                }
            }
            else {
                res.status(401).json({
                    message: 'Пароли не совпадают'
                })
            }
        }
        else {
            res.status(404).json({
                message: 'Пользователь с таким логином не найден'
            })
        }
    }

    async register(req, res) {
        if (!req.body.login || !req.body.password) {
            res.status(400).json({
                message: "Неверный формат данных"
            })
        }
        const candidate = await User.count({where: {login: req.body.login}})
        if (candidate) {
            res.status(409).json({
                message: 'Такой логин занят. Попробуйте другой.'
            })
        } 
        else {
            const salt = bcrypt.genSaltSync(10)
            const password = req.body.password
            const user = new User({
                login:req.body.login,
                password:bcrypt.hashSync(password, salt)
            });
    
            try {
                await user.save()
                const candidate = await User.findOne({where: {login: req.body.login}})
                const tokens = JWTS.generateAndSaveJwt( {candidate})

                res.status(201).json({
                    token: tokens.jwtToken,
                    refreshToken: tokens.refreshToken,
                })
            }
            catch(e) {
                errorHandler(res, e)
            }
        }
    }

    /**
    * Публичный ключ, этим ключём фронт будет шифровать данные
    * */
    async publicKey(req, res) {
        return res.status(200).json(rsa.getPublicKey());
    }

}

module.exports = new authController();
