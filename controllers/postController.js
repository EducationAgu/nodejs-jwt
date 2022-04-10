const connect = require('../connect/connect.js')
const Post = require('../models/postModel.js')
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

        const posts = await Post.findAll(dbRequest);

        delete dbRequest.offset
        delete dbRequest.limit
        // dbRequest.attributes = [[sequelize.fn('COUNT', sequelize.col('*')), 'n_hats']]
        const allAmount =  await Post.count(dbRequest)
        res.status(200).json({posts:posts, allAmount: allAmount/10});
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


}

module.exports = new postController()
