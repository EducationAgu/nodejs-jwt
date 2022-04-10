const Router = require('express')
const router = new Router()
const postController = require('../controllers/postController.js')
const authenticate = require('../middleware/passport.js')

router.post('/add',  authenticate, postController.createPost)
router.patch('/add',  authenticate, postController.updatePost)


router.get('/', authenticate, postController.getPost)
router.post('/all', authenticate, postController.getAllPosts)
router.get('/:id', authenticate, postController.getOnePost)

router.delete('/', authenticate, postController.deletePost)

router.post('/addToFav', authenticate, postController.addToFavorite)
router.post('/deleteFromFav', authenticate, postController.deleteFromFavorite)
module.exports = router
