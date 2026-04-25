const responce = (res,statusCode, message, data) => {
    if(!res){
        console.error('Responce object is null');
        return ;
    }

    const responceObject = {
        status: statusCode < 400 ? 'success' : 'error',
        message,
        data
    }
    return res.status(statusCode).json(responceObject)
}


module.exports = responce