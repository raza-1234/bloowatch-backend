const {users} = require("../sequelized/models")
const {verifyEmailValidation} = require("../validation/validation")

const verifyEmail = async (req, res) => {

  const validation = verifyEmailValidation(req, res);
  if (!validation) return

  const { id, token } = validation
  try {
    const existingUser = await users.findOne({
      where: {id}
    });
    if (!existingUser){
      return res.status(400).json({"message":  "Invalid Link"})
    }

    if (!(existingUser.email_token === token)){
      return res.status(400).json({"message":  "Invalid Link"})
    }

    existingUser.verified = true;
    existingUser.email_token = ""
    await existingUser.save();

    return res.status(200).json({"message": "Email Verified Successfully."})
  } catch (err){
    return res.status(500).json({"errorMessage": err})
  }
}

module.exports = {
  verifyEmail
}