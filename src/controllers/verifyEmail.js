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
      return res.status(400).send("Invalid Link")
    }

    if (!(existingUser.email_token === token)){
      return res.status(400).send("Invalid Link")
    }

    existingUser.verified = true;
    existingUser.email_token = ""
    await existingUser.save();

    return res.status(200).send("Email Verified Successfully.")
  } catch (err){
    return res.status(500).send(err)
  }
}

module.exports = {
  verifyEmail
}