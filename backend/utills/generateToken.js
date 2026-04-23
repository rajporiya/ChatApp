const jwy =require('jsonwebtoken')

const generateToken = (userId)=>{
    return jwy.sign({userId}, process.env.JWT_SECRETKEY,{
        expiresIn: '1y'
    })
}
module.exports = generateToken