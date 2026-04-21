const mongoose = require('mongoose');


const userSchem = mongoose.Schema({
    phoneNumber : {
        type :String,
        unique : true,
        sparse : true
    },
    phoneSuffix : {
        type:String,
        unique:false
    },
    userName : {
        type :String
    },
    email: {
        type: String,
        lowercase : true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    emailOtp : {
        type:String
    },
    emailOtpExpire: {
        type : Date
    },
    profilePic : {
        type : String
    },
    about : {
        type :String
    },
    lastSeen : {
        type: String
    },
    isOnline : {
        type: String
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    agreed : {
        type : Boolean,
        default : false
    }
}, {Timestamp : true})

const User = mongoose.mongo.model("User", userSchem)
module.exports = User