const Router = require('express')
const router = new Router()
const postController = require('../controllers/postController.js')
const passport = require('passport')


router.post('/', passport.authenticate('jwt', {session: false}), postController.createPost)
router.patch('/:id', passport.authenticate('jwt', {session: false}), postController.updatePost)

router.get('/', passport.authenticate('jwt', {session: false}), postController.getPost)
router.get('/:id', passport.authenticate('jwt', {session: false}), postController.getOnePost)

router.delete('/:id', passport.authenticate('jwt', {session: false}), postController.deleteOnePost)
router.delete('/', passport.authenticate('jwt', {session: false}), postController.deletePost)

module.exports = router
