const express = require("express")
const app = express()
const { sequelize } = require("./src/sequelized/models")
const registerRoute = require("./src/routes/register")
const loginRoute = require("./src/routes/logIn")
const logOutRoute = require("./src/routes/logOut")
const verifyEmailRoute = require("./src/routes/verifyEmail")
const productRoute = require("./src/routes/product")
const cartRoute =require("./src/routes/cart")
const couponRoute = require("./src/routes/coupon")
const cookieParser = require("cookie-parser")
const { verifyToken } = require("./src/middlewares/verifyToken")
const cors = require("cors")
require("dotenv").config();

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use("Images", express.static("./Images"))

app.use("/register", registerRoute)
app.use("/login", loginRoute)
app.use("/logOut", logOutRoute)
app.use("/verification", verifyEmailRoute)
//seller side work
app.use("/products", productRoute)
app.use("/coupon", couponRoute)
//buyer side 
app.use("/cart", verifyToken ,cartRoute)

app.listen(process.env.PORT, async(req, res) => {
  await sequelize.authenticate()
})