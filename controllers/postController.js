const connect = require('../connect/connect.js')
const Post = require('../models/postModel.js')
const User = require('../models/authModel')
const Favorite = require('../models/favorite.js')
const Session = require('../models/session')
const Usershifr = require('../models/userShifr')
const Comment = require('../models/coment')
const errorHandler = require('../utils/errorHandler.js')
const {Op, where} = require("sequelize");


class postController {

    async createPost(req, res) {

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
            const postToUser = await Usershifr.findAll({where: {userid: req.headers['user'].id}})

            req.body.id = postToUser[0].UIMapping[req.body.id]

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
        } catch (e) {
            errorHandler(res, e)
        }

    };

    async deletePost(req, res) {
        req.body.id = this.idToId.get(req.headers['user'].id).get(req.body.id)

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
                dbRequest.order.push([req.body.request.sort.field]);
                if (!req.body.request.sort.asc) {
                    dbRequest.order[0].push('DESC');
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
        let s = await Session.findAll({where: {user_id: req.headers['user'].id}})

        if (s.length === 0) {
            await Session.create({
                user_id:  req.headers['user'].id,
                amount: 1,
                lastReq: Date.now()})
        } else {
            if (parseInt(s[0].amount) > 10) {
                const diff = Math.floor((Date.now() - s[0].lastReq.getTime()))/1000;
                if (diff < 60) {
                    res.status(200).json([])
                    return;
                } else {
                    await Session.update({amount: 0, lastReq: Date.now()},{where: {user_id: req.headers['user'].id}});
                    s[0].amount = 0
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

            let changeMap = new Map;

            for(let p in posts) {
                for (let f in favorites) {
                    if (posts[p].dataValues.id === favorites[f].dataValues.postid) {
                        posts[p].dataValues.isFav = true;
                        break
                    }
                }
                let rndId = Math.floor(Math.random()*10000)
                while (changeMap.get(rndId)) {
                    rndId = Math.floor(Math.random()*10000)
                }

                changeMap.set(rndId, posts[p].dataValues.id)
                posts[p].dataValues.id = rndId
            }
            await Usershifr.destroy({where:{userid: req.headers['user'].id}})
            await Usershifr.create({userid: req.headers['user'].id, UIMapping: Object.fromEntries(changeMap)})

            let out = []
            if (req.body.request.favOnly) {
                for(let p in posts) {
                    if (posts[p].dataValues.isFav) {
                        out.push(posts[p])
                    }
                }
                res.status(200).json({posts:out, allAmount: favorites.length/10});
                return
            }

            let amount = Math.floor(allAmount/10)
            res.status(200).json({posts:posts, allAmount: amount});
        } catch(e) {
            console.log( e)
        }
};

    async addComment(req, res) {
        if (req.body.comment) {
            let out = req.body.comment.replace(
                /[\u0000-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u00FF]/g,
                c => '&#' + ('000' + c.charCodeAt(0)).slice(-4) + ';'
            )
            try {
                await Comment.create({user_id: req.headers['user'].id, content: out})
            } catch (e) {
                console.log(e)
            }

            res.status(200)
        }
    }

    async getComments(req, res) {
        const comm = await Comment.findAll();
        let usersId = []
        for(let u in comm) {
            usersId.push(comm[u].user_id)
        }

        const users = await User.findAll({where: {id:{
                    [Op.in]: usersId
                },}})
        let out = []
        for(let c in comm) {
            for(let u in users) {
                if (users[u].id === comm[c].user_id) {
                    out.push(
                        {
                            user: users[u].login,
                            content: comm[c].content
                        })
                    break
                }

            }
        }
        res.status(200).json({Items: out});
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

    async addToFavorite(req, res) {
            try {
                const postToUser = await Usershifr.findAll({where: {userid: req.headers['user'].id}})

                if (postToUser.length > 0){
                    req.body.id = postToUser[0].UIMapping[req.body.id]

                    await Favorite.create({
                        userid: req.headers['user'].id,
                        postid: req.body.id,
                    })
                }
            } catch (e) {
                console.log(e)
            }

        res.status(200)
        return
    };

    async deleteFromFavorite(req, res) {
            try {
                const postToUser = await Usershifr.findAll({where: {userid: req.headers['user'].id}})
                if (postToUser.length > 0) {

                    req.body.id = postToUser[0].UIMapping[req.body.id]
                    await Favorite.destroy({
                        where: {
                            userid: req.headers['user'].id,
                            postid: req.body.id,
                        }
                    })
                }
            } catch (e) {
                console.log(e)
        }
        res.status(200)
        return
    };
}

module.exports = new postController()
