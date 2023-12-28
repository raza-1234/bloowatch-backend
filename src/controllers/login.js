const {users} = require("../sequelized/models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {userAuthorizationValidation} = require("../validation/validation")
const crypto = require("crypto")
const {sendEmail} = require("../utils/sendEmail")
require("dotenv").config()

const logIn = async(req, res) => {
  const validation = userAuthorizationValidation(req, res);
  if (!validation) return; 
  const { email, password } = validation;

  try  {
    const userExist = await users.findOne({ 
      where: { email }
    });

    if (!userExist){
      return res.status(400).send("Wrong User Email");
    }

    const passwordMatch = await bcrypt.compare(password, userExist.password)
    if (!passwordMatch){
      return res.status(400).send("Wrong Password");
    }

    if (!userExist.verified){
      if (!userExist.email_token){
        userExist.email_token = crypto.randomBytes(8).toString("hex");
        await userExist.save()
        const url = `${process.env.BASE_URL}/verify_email/${registerNewUser.id}`;
        await sendEmail(userExist.email, "Verify EmailVerify Email By Entering The Provided-Token Code In Website", url, userExist.email_token)
      }
      return res.status(400).send("First Verify Your Email.An Email Is Sent To Your Account. Please Verify It.")
    }

    const accessToken = jwt.sign(
      {"userEmail": userExist.email},
      process.env.ACCESS_SECRET_KEY,
    )
    
    res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 10 * 1000})
    return res.status(200).send("Log In Successfull.")
    
  } catch(err){
    return res.status(500).send(err)
  } 
}

module.exports = {logIn}