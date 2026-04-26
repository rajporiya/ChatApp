const Conversation = require("../models/converation.model");
const uploadFileToCloudinary = require('../config/cloudinaryConfig')
const Message = require('../models/messages.model')
const responce = require("../utills/responseHandler");

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content, meesageStatus } = req.body;
    const file = req.file;
    const participants = [senderId, receiverId].sort();
    // check conversation already exists
    let conversation = await Conversation.findOne({
      participants: participants,
    });
    if (!conversation) {
      conversation = new conversation({
        participants,
      });
      await conversation.save();
    }
    let imgOrVideo = null;
    let contentType = null;

    // handle file upload
    if (file) {
      const uploadFile = await uploadFileToCloudinary(file);
      if (!uploadFile?.secure_url) {
        return responce(res, 400, "Failed to upload");
      }
      imgOrVideo = uploadFile?.secure_url;
      if (file.mimetype.startwith("image")) {
        contentType = "image";
      } else if (file.mimetype.startwith("video")) {
        contentType = "video";
      } else {
        return responce(res, 400, "Unsupported file type");
      }
    } else if (content?.trim()) {
      contentType = "text";
    } else {
      return responce(res, 400, "Message content is require");
    }
    const message = new Message({
        conversation: conversation?._id,
        sender: senderId,
        receiver : receiverId,
        content,
        contentType,
        imgOrVideo,
        messageStatus
    })
    await message.save()
    if(message?.content){

        conversation.lastMessage = message?._id
    }
    conversation.unReadCount +=1;
    await conversation.save()
  } catch (error) {}
};
