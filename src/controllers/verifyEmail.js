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
      res.status(404).json({"message":  "User Not Exist."})
      return
    }
    
    if (existingUser.email_token !== emailToken){
      res.status(403).json({"message":  "Invalid Link"})
      return;
    }

    existingUser.verified = true;
    existingUser.email_token = ""
    await existingUser.save();

    res.status(200).json({"message": "Email Verified Successfully."})
    return;
  } catch (err){
    console.log(err);
    res.status(500).json({"errorMessage": err})
    return;
  }
}

module.exports = {
  verifyEmail
}