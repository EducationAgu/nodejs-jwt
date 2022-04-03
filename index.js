const express = require('express')
const app = express()

const db = require('./connect/connect.js')
const User = require('./models/authModel.js')
const Post = require('./models/postModel.js')

const passport = require('passport')

const models = require('./models/model.js')
const routers = require('./routers/router.js')

const https = require(`https`);
const fs = require(`fs`);

const options = {
    key: fs.readFileSync(`./certs/service.key`, "utf-8"),
    cert: fs.readFileSync(`./certs/service.crt`, "utf-8")
};

const PORT = process.env.PORT || 5000;

const cors = require('cors')
const bodyParser = require('body-parser');
const morgan = require('morgan')
const sequelize = require('./connect/connect.js')

const jwtStrategy = require('./middleware/passport.js')
const bcrypt = require("bcryptjs");
const JWTS = require("./sevices/jwtService");
const errorHandler = require("./utils/errorHandler");

app.use(passport.initialize());
passport.use('jwt', jwtStrategy)


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'))
app.use(cors())

app.use(express.json())
app.use('/api', routers)

const start = async  () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log('Server started on port ' + PORT)
        https.createServer(options, app).listen(PORT);
        await initTestUsersAndPosts()
    }
    catch(e) {
        console.log(e)
    }
}

const initTestUsersAndPosts= async () => {

    let user = await User.findOne({where: {login: 'testuser'}})
    if (!user) {
        const salt = bcrypt.genSaltSync(10)
        const password = '123123'
        user = await User.create({
            login: 'testuser',
            password:bcrypt.hashSync(password, salt)
        })
    }

    const posts = await Post.count();
    if (posts === 0) {
        await Post.create({name: 'cats', userid: user.id});
        await Post.create({name: 'dogs', userid: user.id});
        await Post.create({name: 'cats&dogs', userid: user.id});
        await Post.create({name: 'neither of them', userid: user.id});
    }
}

start()
