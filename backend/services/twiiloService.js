const twilio = require("twilio");

// twilio credencial from env
const accountId = process.env.TWILLO_ACCOUNT_SID;
const authToken = process.env.TWILLO_AUTH_TOKEN;
const serviceSid = process.env.TWILLO_SERVICE_SID;

const client = twilio(accountId, authToken);

// send otp to number
const sendOtpToPhoneNumber = async (phoneNumber) => {
  try {
    console.log("sending otp in number");
    if (!phoneNumber) {
      throw new Error("phone number is required");
    }
    const responce = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });
    console.log("this is my otp responce");
    return responce;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send otp");
  }
};

// verify otp
const verifyOtp = async (phoneNumber, otp) => {
  try {
    const responce = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code: otp,
      });
    console.log("this is my otp responce", responce);
    return responce;
  } catch (error) {
    console.log(error);
    throw new Error("otp verification failed");
  }
};

module.exports =  {
    sendOtpToPhoneNumber,
    verifyOtp
}