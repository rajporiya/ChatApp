const jwt = require('jsonwebtoken');
const responce = require('../utills/responseHandler');


const authMiddleware = (req, res,next)=>{
    const authToken = req.cookies?.token;

    if(!authToken){
        return responce(res, 401, ' authorization missing')
    }

    try {
        const decode = jwt.verify(authToken, process.env.JWT_SECRETKEY)
    } catch (error) {
        
    }
}