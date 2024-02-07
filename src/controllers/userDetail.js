const {users} = require("../../src/sequelized/models")
const {checkUserById} = require("../utils/checkUser")

const userDetail = async(req, res) => {

  console.log("in user detailllll");
  const {
    params: {
      id
    },
    userId
  } = req 

  if (Number(id) !== userId){ 
    return res.status(403).json({"message": "Access denied."})
  }

  try {
    const existingUser = await checkUserById(id);
    if (!existingUser){
      return res.status(400).json({"message":  "User Not Exist."})
    }
    return res.status(200).json({name: existingUser.name, email: existingUser.email, id: existingUser.id})
  }catch (err) {
    console.log(err);
  }
}

module.exports = {
  userDetail
}