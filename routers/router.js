const Router = require('express')
const router = new Router()

const userRouter = require('./authRouter.js')
const officeRouter = require('./officeRouter.js')
const postRouter = require('./postRouter.js')

router.use('/user', userRouter)
router.use('/office', officeRouter)
router.use('/post', postRouter)

module.exports = router
