const {users} = require("../sequelized/models");
const bcrypt = require("bcrypt")

const editUser = async (req,  res) => {
  const {
    name,
    oldPassword,
    newPassword,
    email
  } = req.body;

  try {
    const userExist =  await users.findOne({
      where: {
        email
      }
    })

    if (!userExist){
      return res.status(404).json({"message": "user does not exist"});
    }

    const match = await bcrypt.compare(oldPassword, userExist.password)
    if (!match){
      return res.status(400).json({"message": "old password is not correct."});
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updateUser = {
      name: name.trim(),
      password: encryptedPassword
    }
    await userExist.update(updateUser);
    return res.status(200).json({"message": "Record Updated."})
  } catch (err){
    console.log(err);
    return res.status(500).json({"message": err.message})
  }
}

module.exports = {
  editUser
}