const jwt = require("jsonwebtoken")
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie?.jwt){ 
    return res.status(403).send("You Are Logged Out")
  }
  const token = cookie.jwt
  jwt.verify(
    token,
    process.env.ACCESS_SECRET_KEY,
    (err) => {
      if(err){
        return res.sendStatus(403);
      }
      next();
    }
  )
}

module.exports = {verifyToken}