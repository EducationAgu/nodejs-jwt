const express = require('express')
const app = express()

const db = require('./connect/connect.js')

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
        console.log(options.key)
        console.log(options.cert)
        https.createServer(options, app).listen(PORT);
    }
    catch(e) {
        console.log(e)
    }
}

start()
