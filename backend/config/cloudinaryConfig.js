const multer = require('multer')
const cloudinary = require('cloudinary')
const dotenv = require("dotenv")
const fs = require('fs')
const { error } = require('console')

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})

const uploadFileToCloudinary = (file)=>{
    const option = {
        resource_type : file.minetype.startwith('video')? 'video' : 'image'
    }
    return new Promise((resolve, reject)=>{
        const uploader = file.minetype.startwith('video')? cloudinary.uploadFileToCloudinary.uploader.upload_large : cloudinary.uploader.upload;
        uploader(file.path, option, (error, result)=>{
            fs.unlink(file.pathx)
            if(error){
                return reject(erro)
            }
            resolve(result)
        })
    })
}

const multerMiddleware = multer({dest:'uploads/'}).single('media')
module.exports = {
    uploadFileToCloudinary, multerMiddleware
}