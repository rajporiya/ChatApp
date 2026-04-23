const User = require("../models/user.model");
const otpGenerate = require("../utills/otpGenerator");
const responce = require("../utills/responseHandler");


// step -1 send otp
const sendOtp = async(req,res)=>{
    const {phoneNumber, phoneSuffix, email} = req.body;

    const otp =otpGenerate();
    const expiry = new Date(Date.now() + 5*60*1000)
    let user;

    try {
        // otp send in email
        if(email){
            user = await User.findOne({email});

            if(!user){
                user = new User({email})
            }
            user.emailOtp = otp
            user.emailOtpExpire = expiry;
            await user.save()

            return responce(res, 200, 'Otp send to your email', {email})
        }
        if(!phoneNumber|| !phoneSuffix){
            return res(res, 400, 'Phone number and phone country are requires')
        }

        const fullPhoneNumber = `${phoneSuffix} ${phoneNumber}`
        user = await User.findOne({phoneNumber});
        if(!user){
            user = await new User ({phoneNumber, phoneSuffix})
        }
        await user.save();

        return responce(res, 200, 'Oopt send successfully', user)
    } catch (error) {
        console.log(error);
        return responce(res, 500,'Internal server error')
        
    }
}