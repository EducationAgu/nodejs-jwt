const connect = require('../connect/connect.js')
const Post = require('../models/postModel.js')
const Favorite = require('../models/favorite.js')
const Session = require('../models/session')
const errorHandler = require('../utils/errorHandler.js')
const {Op, where} = require("sequelize");


class postController {

    async createPost(req, res) {
        console.log()

        try {
            const posts = await new Post({
            name: req.body.name,
            userid: req.headers['user'].id
          }).save() 
         res.status(200).json(posts) 
        } catch(e) {
            errorHandler(res, e)
        }

    };

    async updatePost(req, res) {
        try {
            const posts = await Post.update(
                {
                    name: req.body.name,
                    userid: req.headers['user'].id,
                },
                {
                    where: {id: req.body.id}
                })
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

        let dbRequest = {
            limit: 10,
            offset: 0,
        };

        if(req.body.request.paging) {
            if (req.body.request.paging.take) {
                dbRequest.limit = req.body.request.paging.take;
            }
            if (req.body.request.paging.skip) {
                dbRequest.offset = req.body.request.paging.skip;
            }
        }

        if (req.body.request.sort) {
            dbRequest.order = []

            if (req.body.request.sort.field) {
                dbRequest.order.push(req.body.request.sort.field);
                if (req.body.request.sort.asc && req.body.request.sort.asc === 'DESC') {
                    dbRequest.order.push(req.body.request.sort.asc);
                }
            }
        }
        if (req.body.request.filter && req.body.request.filter !== "") {
            dbRequest.where = {
                name: {
                    [Op.like]: '%'+req.body.request.filter+'%'
                },
            };
        }
        const s = await Session.findAll({where: {user_id: req.headers['user'].id}})

        if (s.length === 0) {
            await Session.create({
                user_id:  req.headers['user'].id,
                amount: 1,
                lastReq: Date.now()})
        } else {
            if (parseInt(s[0].amount) > 10) {
                const diff = Math.floor((Date.now() - s[0].lastReq.getTime())/1000/60);
                if (diff < 60) {
                    res.status(200).json([])
                    return;
                } else {
                    await Session.update({amount: 0},{where: {user_id: req.headers['user'].id}});

                }
            }
            await Session.update({amount: parseInt(s[0].amount) + 1},{where: {user_id: req.headers['user'].id}});
        }


        try {
            let posts = await Post.findAll(dbRequest);

            delete dbRequest.offset
            delete dbRequest.limit
            const allAmount =  await Post.count(dbRequest)

            let postsId = []
            for (let p in posts) {
                postsId.push(posts[p].dataValues.id)
            }
            const favorites = await Favorite.findAll(
                {
                    where:{
                        [Op.and]: [{
                            postid:
                                {
                                    [Op.in]: postsId
                                },
                            userid: req.headers['user'].id,
                        }]
                    }
                }
            )
            for (let f in favorites) {
                for(let p in posts) {
                    if (posts[p].dataValues.id === favorites[f].dataValues.postid) {
                        posts[p].dataValues.isFav = true;
                        break
                    }
                }
            }
            res.status(200).json({posts:posts, allAmount: allAmount/10});
        } catch(e) {
            errorHandler(e)
        }
}


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

    async addToFavorite(req, res) {
        await Favorite.create({
            userid: req.headers['user'].id,
            postid: req.body.id,
        })
    };

    async deleteFromFavorite(req, res) {
        await Favorite.destroy({
            where: {
                userid: req.headers['user'].id,
                postid: req.body.id,
            }
        })
    };
}

module.exports = new postController()
