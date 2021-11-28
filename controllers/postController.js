const connect = require('../connect/connect.js')
const Post = require('../models/postModel.js')
const errorHandler = require('../utils/errorHandler.js')


class postController {

    async createPost(req, res) {
        /*const name = req.body.namePost
        const newPost = await connect.query('insert into posts (namePost) values ($1) returning *', [name])
        res.json(newPost.rows[0])*/
        try {
            const posts = await new Post({
            name: req.body.name
          }).save() 
         res.status(200).json(posts) 
        } catch(e) {
            errorHandler(res, e)
        }

    };

    async updatePost(req, res) {
        /*const {id, name} = req.body
        const post = await connect.query('update posts set namePost = $1 where idPost = $2 returning *', [name, id])
        res.json(post.rows[0])*/
        try {
            const posts = await Post.findOneAndUpdate(
                {_id: req.params.id},
                {$set: req.body},
                {new:true}
                )
            res.status(200).json(posts)
        } catch(e) {
            errorHandler(res, e)
        }
    };

    async deleteOnePost(req, res) {
        /*const id = req.params.idPost
        const post = await connect.query('delete from posts where idPost = $1', [id])
        res.json(post.rows[0])*/
        try {
            await Post.remove({_id: req.params.id}) 
            res.status(200).json({
               message: 'Удалено'
            }) 
        } catch(e) {
            errorHandler(res, e)
        }
    };

    async deletePost(req, res) {      
        /*const post = await connect.query('delete from posts')
        res.json(post.rows)*/
        try {

        } catch(e) {
            errorHandler(res, e)
        }
    };

    async getPost(req, res) {
        /*const post = await connect.query('select * from posts')
        res.json(post.rows)*/

        try {
            const posts = await Post.findAll({where: {userid: req.user.id}})
            res.status(200).json(posts)
            
            
        } catch(e) {
            errorHandler(res, e)
        }
    };

    async getOnePost(req, res) {
        /*const id = req.params.idPost
        const post = await connect.query('select * from posts where idPost = $1', [id])
        res.json(post.rows[0])*/
        try {
            const posts = await Post.findOne({where: {id: req.body.id}})
            res.status(200).json(posts)
            
            
        } catch(e) {
            errorHandler(res, e)
            
        }
    };


}

module.exports = new postController()