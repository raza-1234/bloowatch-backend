const express = require("express")
const app = express()
const {sequelize} = require("./src/sequelized/models")
const registerRoute = require("./src/routes/register")
const loginRoute = require("./src/routes/logIn")
const logOutRoute = require("./src/routes/logOut")
const verifyEmailRoute = require("./src/routes/verifyEmail")
const cookieParser = require("cookie-parser")
const {verifyToken} = require("./src/middlewares/verifyToken")
require("dotenv").config();

app.use(cookieParser())
app.use(express.json())

app.use("/register", registerRoute)
app.use("/login", loginRoute)
app.use("/logOut", logOutRoute)
app.use("/verification", verifyEmailRoute)
app.get("/dashboard", verifyToken, (req, res) => {
  res.status(200).send("Welcome to dashboard")
})

app.listen(process.env.PORT, async(req, res) => {
  await sequelize.authenticate()
})