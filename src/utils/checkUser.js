const {users} = require("../sequelized/models")

const checkUser = async (id) => {
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
  } catch(err) {
    console.log(err);
  }
}

module.exports = {checkUser}