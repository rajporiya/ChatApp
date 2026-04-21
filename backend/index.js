const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDb = require('./config/db')

dotenv.config()

const Port = process.env.PORT;
const app = express();


connectDb();
app.listen(()=>{
    
    console.log(`server running on ${Port}`);
    
})