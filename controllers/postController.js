const connect = require('../connect/connect.js')
const Post = require('../models/postModel.js')
const Session = require('../models/session')
const errorHandler = require('../utils/errorHandler.js')
const {Op, where} = require("sequelize");


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

    async deletePost(req, res) {
        if (req.body.id) {
            try {
                await Post.destroy({where: req.body.id})
            } catch(e) {
                errorHandler(res, e)
            }
        }
    };

    async getAllPosts(req, res) {
        let skip = 0;
        let take = 2;
        if(req.body.page) {
            if (req.body.page.take) {
                take = req.body.page.take
            }
            if (req.body.page.skip) {
                skip = req.body.page.skip
            }
        }

        try {
            if (req.body.search || req.body.search !== "") {
                const s = await Session.findAll({where: {user_id: req.headers['user'].id}})
                if (s.length === 0) {
                    const posts = await Post.findAll({
                        where: {
                            name: {
                                [Op.like]: '%'+req.body.search+'%'
                            }
                        },
                        limit: take,
                        offset: skip,
                    })
                    await Session.create({
                        user_id:  req.headers['user'].id,
                        amount: 1,
                        lastReq: Date.now()})
                    res.status(200).json(posts)

                } else if (parseInt(s[0].amount) > 10) {
                    const diff = Math.floor((Date.now() - s[0].lastReq.getTime())/1000/60);
                    if (diff < 60) {
                        res.status(200).json([])
                        return
                    } else {
                        await Session.update({amount: 0},{where: {user_id: req.headers['user'].id}})
                    }
                }

                const posts = await Post.findAll({
                    where: {
                        name: {
                            [Op.like]: '%'+req.body.search+'%'
                        },
                    },
                    limit: take,
                    offset: skip,
                })
                const s2 = await Session.findAll({where: {user_id: req.headers['user'].id}})
                await Session.update({amount: parseInt(s2[0].amount)+1},{where: {user_id: req.headers['user'].id}})
                res.status(200).json(posts)
            } else {
                const posts = await Post.findAll()
                res.status(200).json(posts)
                return
            }

        } catch(e) {
            errorHandler(res, e)
        }
    };

    async getPost(req, res) {
        try {
            const posts = await Post.findAll({where: {userid: req.headers['user'].id}})
            res.status(200).json(posts)
        } catch(e) {
            errorHandler(res, e)
        }
    };

    async getOnePost(req, res) {
        try {
            const posts = await Post.findOne({where: {id: req.body.id}})
            res.status(200).json(posts)
            
            
        } catch(e) {
            errorHandler(res, e)
            
        }
    };


}

module.exports = new postController()
