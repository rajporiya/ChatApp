const mongoose = require('mongoose')

const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`mongodn connected sucessfully`);
        
    } catch (error) {
        console.log('mongo not connected: -', error);
        process.exit(1)
        
    }
}

module.exports = connectDb