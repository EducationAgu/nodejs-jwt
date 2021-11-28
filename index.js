const express = require('express')

const db = require('./connect/connect.js')

const passport = require('passport')

const models = require('./models/model.js')
const routers = require('./routers/router.js')


const PORT = process.env.PORT || 5000;

const cors = require('cors')
const bodyParser = require('body-parser');
const morgan = require('morgan')
const sequelize = require('./connect/connect.js')

const app = express()


app.use(passport.initialize());
require('./middleware/passport.js')(passport);

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
        app.listen(PORT)
    }
    catch(e) {
        console.log(e)
    }
}

start()
