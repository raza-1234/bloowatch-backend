const {users} = require("../sequelized/models")

const checkUserById = async (id) => {
  try {
    const userExist = await users.findOne({
      where: {
        id
      }
    })
    if (!userExist){
      return false;
    }
    return userExist;
  } catch (err){
    throw new Error(err)
  }
};

const checkUserByEmail = async (email) => {
  try {
    const userExist = await users.findOne({
      where: {
        email
      }
    })
    if (!userExist){
      return false;
    }
    return userExist;
  } catch (err){
    throw new Error(err)
  }
};

module.exports = { checkUserById, checkUserByEmail }