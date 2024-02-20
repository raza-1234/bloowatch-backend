const jwt = require("jsonwebtoken")
require("dotenv").config();

const verifyToken = (req, res, next) => {

  const authToken = req?.headers?.authorization

  if (!authToken){
    res.status(401).json({"message": "You are not logged in."});
    return;
  }

  const token = authToken.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_SECRET_KEY,
    (err, decodeToken) => {
      if (err){
        res.status(403).json({"message": "token expire"});
        return;
      }
      req.userId = decodeToken.userId;
      next();
    }
  )
}

module.exports = {verifyToken}