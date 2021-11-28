const Router = require('express')
const authController = require('../controllers/authController.js')

const router = new Router()

router.post('/login', authController.login)
router.post('/register', authController.register)
router.get('/rsa-key', authController.publicKey)

module.exports = router
