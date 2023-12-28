const {users} = require("../sequelized/models")

const logOut = async (req, res) =>  {

  try {
    const cookie = req.cookies
    if (!cookie?.jwt){
      return res.sendStatus(205);
    }
    res.clearCookie("jwt", {httpOnly: true});
    return res.status(200).send("Logout Successfully.");
  } catch (err){
    return res.status(500).json(err)
  }
}

module.exports = {logOut}