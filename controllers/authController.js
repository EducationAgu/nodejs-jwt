const bcrypt = require('bcryptjs');
const connect = require('../connect/connect.js')
const User = require('../models/authModel.js')
const jwt = require('jsonwebtoken')
const keys = require('../config/jwt.js')
const errorHandler = require('../utils/errorHandler.js')

class authController {

    async login(req, res) {
        const candidateCount = await User.count({where: {login: req.body.login}})
        const candidate = await User.findOne({where: {login: req.body.login}})
        if (candidateCount) {
            const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
            if (passwordResult) {
                const token = jwt.sign({
                    login : candidate.login,
                    id: candidate.id
                }, keys.jwt, {expiresIn: 60 * 60})
                res.status(200).json({
                    token: `Bearer ${token}`
                })
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
                res.status(201).json(user)
            }
            catch(e) {
                errorHandler(res, e)

            }
            
        }
    }

}

module.exports = new authController();
