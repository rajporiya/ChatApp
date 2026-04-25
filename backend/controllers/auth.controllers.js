const User = require("../models/user.model");
const sendOtpTOEmail = require("../services/emailService");
const otpGenerate = require("../utills/otpGenerator");
const responce = require("../utills/responseHandler");
const twilloService = require("../services/twiiloService.js");
const generateToken = require("../utills/generateToken.js");
const { uploadFileToCloudinary } = require("../config/cloudinaryConfig.js");
const Conversation = require('../models/converation.model.js')
// step -1 send otp
const sendOtp = async (req, res) => {
  const { phoneNumber, phoneSuffix, email } = req.body;

  const otp = otpGenerate();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);
  let user;

  try {
    // otp send in email
    if (email) {
      user = await User.findOne({ email });

      if (!user) {
        user = new User({ email });
      }
      user.emailOtp = otp;
      user.emailOtpExpire = expiry;
      await user.save();
      await sendOtpTOEmail(email, otp);
      return responce(res, 200, "Otp send to your email", { email });
    }
    if (!phoneNumber || !phoneSuffix) {
      return responce(res, 400, "Phone number and phone country are requires");
    }

    const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
    user = await User.findOne({ phoneNumber });
    if (!user) {
      user = await new User({ phoneNumber, phoneSuffix });
    }
    await user.save();
    await twilloService.sendOtpToPhoneNumber(fullPhoneNumber);

    return responce(res, 200, "Otp send on phone number successfully", user);
  } catch (error) {
    console.log(error);
    return responce(res, 500, "Internal server error");
  }
};
// step-2 verify Otp
const verifyOtp = async (req, res) => {
  const { phoneNumber, phoneSuffix, email, otp } = req.body;

  try {
    let user;
    if (email) {
      user = await User.findOne({ email });
      if (!user) {
        return responce(res, 404, "User not found");
      }
      const now = new Date();
      if (
        !user.emailOtp ||
        String(user.emailOtp) !== String(otp) ||
        now > user.emailOtpExpire
      ) {
        return responce(res, 400, "invalid or expire otp");
      }
      user.isVerified = true;
      user.emailOtp = null;
      user.emailOtpExpire = null;
      await user.save();
    } else {
      if (!phoneNumber || !phoneSuffix) {
        return responce(res, 400, "Phone number and phone country are requires");
      }
      const fullPhoneNumber = `${phoneSuffix} ${phoneNumber}`;
      user = await User.findOne({ phoneNumber });
      if (!user) {
        return responce(res, 404, "User not found");
      }
      const result = await twilloService.verifyOtp(fullPhoneNumber, otp);
      if (result.status !== "approved") {
        return responce(res, 400, "Invalid otp");
      }
      user.isVerified = true;
      await user.save();
    }
    const token = generateToken(user?._id);
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    return responce(res, 200, "Otp verifeied successfully", { token, user });
  } catch (error) {
    console.log(error);
    return responce(res, 500, "Internal server error");
  }
};

const updateProfile = async (req,res)=>{
  const {userName, agreed,about} = req.body;
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId)
    if(!user){
      return responce(res, 404, 'User not found')
    }
    const file = req.file
    if(file){
      const uploadResult = await uploadFileToCloudinary(file);
      user.profilePicture =uploadResult?.secure_url
    }else if(req.body.profilePicture){
      user.profilePicture = req.body.profilePicture;
    }
    if(userName) user.userName = userName;
    if(typeof agreed !== 'undefined') user.agreed = agreed
    if(about) user.about = about
    await user.save()
    
    return responce(res,200, 'User Profile upadted successfully')
  } catch (error) {
    console.log(error);
    return responce(res, 500, "Internal server error");
  }
}

const logOutUser = (req,res)=>{
  try {
    res.cookie("auth_token", "", {expires:new Date(0)})
    return responce(res, 200, "Logout Successfully")
  } catch (error) {
    console.log(error);
    return responce(res, 500, "Internal server error");
  }
}

const checkAuthenticate = async (req,res)=>{
  try {
    const userId = req.user.userId;
    if(!userId){
      return responce(res, 404, 'Unauthorization ! plz login')
    }
    const user = await User.findById(userId)
    if(!user){
     return responce(res, 404, 'user not found')
    }
    return responce(res,200,"User retrive and allow to use whatsapp", user)
  } catch (error) {
    console.log(error);
    return responce(res, 500, "Internal server error");
  }
}

const getAllUser = async (req,res)=>{
  const loggedInUser = req.user.userId
  try {
    const users = await User.find({_id:{$ne:loggedInUser}}).select("userName profilePic lastSeen isOnline phoneSuffix phoneNumber about   isVerified").lean();
    const usersWithConversation = await Promise.all(users.map(async(user)=>{
      const conversation = await Conversation.findOne({
        participants: {$all : [loggedInUser,user?._id]}
      }).populate({
        path:"lastMessae",
        select: "Content createdAt sender receiver"
      }).lean();

      return {
        ...user,
        conversation: conversation || null 
      }
    })) 

    return responce(res, 200, 'Users retrieve successfully')
  } catch (error) {
    console.log(error);
    return responce(res, 500, "Internal server error");
  }
}
module.exports = {
    sendOtp, verifyOtp, updateProfile, logOutUser,checkAuthenticate,getAllUser 
}