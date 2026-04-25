const jwt = require('jsonwebtoken');
const responce = require('../utills/responseHandler');


const authMiddleware = (req, res,next)=>{
    const authToken = req.cookies?.auth_token;
;

    if(!authToken){
        return responce(res, 401, 'authorization missing')
    }

    try {
        const decode = jwt.verify(authToken, process.env.JWT_SECRETKEY)
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        return responce(res,401,'Invalid or expired token')
        
    }
}

module.exports = {
    authMiddleware
}