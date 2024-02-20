const {users} = require("../../src/sequelized/models")
const {checkUserById} = require("../utils/checkUser")

const userDetail = async (req, res) => {

  const {
    params: {
      id
    },
    userId
  } = req 

  if (Number(id) !== userId){ 
    res.status(403).json({"message": "Access denied."})
    return;
  }

  try {
    const existingUser = await checkUserById(id);
    if (!existingUser){
      res.status(400).json({"message":  "User Not Exist."})
      return;
    }
    res.status(200).json({name: existingUser.name, email: existingUser.email, id: existingUser.id})
    return;
  }catch (err) {
    // console.log(err);
    res.status(500).json({"message": err})
    return
  }
}

module.exports = {
  userDetail
}