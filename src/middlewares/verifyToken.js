const jwt = require("jsonwebtoken")
require("dotenv").config();

const verifyToken = (req, res, next) => {

  const cookieToken = req.cookies
  const authToken = req.headers.authorization

  if (!cookieToken?.jwt || !authToken){
    return res.status(401).json({"message":  "You are not logged in."})
  }

  const token = authToken.split(" ")[1];

  if (cookieToken.jwt !== token){
    return res.status(403).json({"message": "Header's token does not match with token in cookie."})
  }

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