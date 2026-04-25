const express = require('express')

const authController = require('../controllers/auth.controllers.js')
const { authMiddleware } = require('../midleware/auth.middleware.js')
const { multerMiddleware } = require('../config/cloudinaryConfig.js')
const router = express.Router()

router.post('/send-otp',authController.sendOtp)
router.post('/verify-otp',authController.verifyOtp)

// protected middleware
router.put('/update-profile', authMiddleware,  multerMiddleware, authController.updateProfile)
router.get('/check-auth',authMiddleware,  multerMiddleware,authController.checkAuthenticate)
router.get('/users',authMiddleware,authController.getAllUser)

router.get('/logout', authController.logOutUser)





module.exports = router