const bcrypt = require('bcryptjs');
const connect = require('../connect/connect.js')
const User = require('../models/authModel.js')
const jwt = require('jsonwebtoken')
const keys = require('../config/jwt.js')
const rsa = require('../sevices/rsaService.js')

const errorHandler = require('../utils/errorHandler.js')

class authController {

    async login(req, res) {

        if (!req.body.login || !req.body.password) {
            res.status(400).json({
                message: "Неверный формат данных"
            })
        }

        req.body.password = rsa.decrypt(req.body.password)
        const candidate = await User.findOne({where: {login: req.body.login}})
        if (candidate) {
            if (bcrypt.compareSync(req.body.password, candidate.password)) {
                const token = jwt.sign({
                    login : candidate.login,
                    id: candidate.id
                }, keys.jwt, {expiresIn: 60 * 60})

                res.status(200).json(token)
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
                const token =  jwt.sign(
                    {
                        login : candidate.login,
                        id: candidate.id
                    },
                        keys.jwt,
                    {
                        expiresIn: 60 * 60
                    })
                res.status(201).json({
                    token: `${token}`
                })
            }
            catch(e) {
                errorHandler(res, e)
            }
        }
    }

    async publicKey(req, res) {
        return res.status(200).json(rsa.getPublicKey());
    }
}

module.exports = new authController();
