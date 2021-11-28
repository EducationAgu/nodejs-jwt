const Router = require('express')
const router = new Router()
const officeController = require('../controllers/officeController.js')
const authenticate = require('../middleware/passport.js')

router.post('/', authenticate, officeController.createOffice)
router.patch('/', authenticate, officeController.updateOffice)

router.get('/all', authenticate, officeController.getOffice)
router.get('/', authenticate, officeController.getOneOffice)

router.delete('/', authenticate, officeController.deleteOffice)

module.exports = router
