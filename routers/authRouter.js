const Router = require('express')
const router = new Router()
const authController = require('../controllers/authController.js')

router.post('/login', authController.login)


router.post('/register', authController.register)


module.exports = router
