const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDb = require('./config/db')
const bodyParser = require('body-parser')
const authRoute = require('./routes/auth.route')

dotenv.config()

const Port = process.env.PORT;
const app = express();

// middlewear
app.use(express.json()) // parse body data
app.use(cookieParser()) /// parse token on every requst
app.use(bodyParser.urlencoded({extended:true}))


connectDb();

// routes
app.use('/api/auth', authRoute);

app.listen(Port, () => {
    console.log(`server running on ${Port}`);
});