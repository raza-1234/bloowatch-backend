const jwt = require("jsonwebtoken")
require("dotenv").config();

const verifyToken = (req, res, next) => {

  console.log("in verify token middle wareeeeee....");
  const authToken = req.headers.authorization

  if (!authToken){
    return res.status(401).json({"message":  "You are not logged in."})
  }

  const token = authToken.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_SECRET_KEY,
    (err, decodeToken) => {
      if (err){
        return res.status(403).send("token expire");
      }
      req.userId = decodeToken.userId;
      next();
    }
  )
}

module.exports = {verifyToken}