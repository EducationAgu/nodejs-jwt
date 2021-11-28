const Router = require('express')
const router = new Router()
const officeController = require('../controllers/officeController.js')
const passport = require('passport')
const authentificate = require('../middleware/passport.js')

router.post('/', authentificate, officeController.createOffice)
router.patch('/:id', passport.authenticate('jwt', {session: false}), officeController.updateOffice)

router.get('/', authentificate, officeController.getOffice)
router.get('/:id', passport.authenticate('jwt', {session: false}), officeController.getOneOffice)

router.delete('/:id', passport.authenticate('jwt', {session: false}), officeController.deleteOneOffice)
router.delete('/', passport.authenticate('jwt', {session: false}), officeController.deleteOffice)

module.exports = router
