const express = require("express")
const { users } = require("../sequelized/models")
const crypto = require("crypto")
const { sendEmail } = require("../utils/sendEmail")
const bcrypt = require("bcrypt")
const { registerUserValidation } = require("../validation/validation")
require("dotenv").config();

const registerUser = async(req, res) => {

  const validation = registerUserValidation(req, res);
  if (!validation) return;

  const { name, email, password } = validation

  try {
    const existingUser = await users.findOne({
      where: { email }
    })
    if (existingUser){
      return res.status(400).json({"message": "Entered Email Is Already Registered."})
    }

    const encryptedPassword = await bcrypt.hash(password, 10)
    const newUser = {
      name,
      email,
      password: encryptedPassword,
      email_token: crypto.randomBytes(8).toString("hex")
    } 

    const registerNewUser = await users.create(newUser)
    const url = `${process.env.BASE_URL}/verify_email/${registerNewUser.id}`;
    await sendEmail(registerNewUser.email, "Verify Email By Entering The Provided-Token Code In Website", url, newUser.email_token);

    return res.status(200).json({"message": "An Email Is Sent To Your Account. Please Verify Your Email."})
  } catch (err){
    return res.status(500).json({"message": err})
  }
}

module.exports = {
  registerUser
}