const {users} = require("../sequelized/models")
const {verifyEmailValidation} = require("../validation/validation")
const {checkUserById} = require("../utils/checkUser")

const verifyEmail = async (req, res) => {

  const validation = verifyEmailValidation(req, res);
  if (!validation) return

  const { id, emailToken } = validation
  try {
    const existingUser = await checkUserById(id);
    if (!existingUser){
      return res.status(400).json({"message":  "User Not Exist."})
    }
    
    if (existingUser.email_token !== emailToken){
      return res.status(400).json({"message":  "Invalid Link"})
    }

    existingUser.verified = true;
    existingUser.email_token = ""
    await existingUser.save();

    return res.status(200).json({"message": "Email Verified Successfully."})
  } catch (err){
    console.log(err);
    return res.status(500).json({"errorMessage": err})
  }
}

module.exports = {
  verifyEmail
}