const {users} = require("../sequelized/models")

const logOut = (req, res) =>  {
    const cookie = req.cookies
    if (!cookie?.jwt){
      return res.sendStatus(205);
    }
    res.clearCookie("jwt", {httpOnly: true});
    return res.status(200).json({"message": "Logout Successfully."});  
}

module.exports = {logOut}