const { users } = require("../sequelized/models");
const bcrypt = require("bcrypt")
const { checkUserByEmail } = require("../utils/checkUser")

const editUser = async (req,  res) => {
  const {
    name,
    currentPassword,
    newPassword,
    email
  } = req.body;

  try {
    
    const userExist = await checkUserByEmail(email)

    if (!userExist){
      res.status(404).json({"message": "user does not exist"});
      return;
    }

    const match = await bcrypt.compare(currentPassword, userExist.password)
    if (!match){
      res.status(400).json({"message": "Wrong Password."});
      return;
    }

    const updateUser = {
      name: name
    }

    if (!newPassword){
      updateUser.password = userExist.password;
    }
    else {
      const encryptedPassword = await bcrypt.hash(newPassword, 10);
      updateUser.password = encryptedPassword;
    }
    await userExist.update(updateUser);
    res.status(200).json({"message": "Changes Saved."})
    return;
    
  } catch (err){
    res.status(500).json({"message": err.message})
    return;
  }
}

module.exports = {
  editUser
}