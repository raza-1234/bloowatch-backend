const express = require("express")
const app = express()
const { sequelize } = require("./src/sequelized/models")
const registerRoute = require("./src/routes/register")
const loginRoute = require("./src/routes/logIn")
const logOutRoute = require("./src/routes/logOut")
const verifyEmailRoute = require("./src/routes/verifyEmail")
const productRouter = require("./src/routes/product")
const cartRouter =require("./src/routes/cart")
const searchProductRouter = require("./src/routes/searchProduct")
const coupanRouter = require("./src/routes/coupan")
const cookieParser = require("cookie-parser")
const { verifyToken } = require("./src/middlewares/verifyToken")
require("dotenv").config();

app.use(cookieParser())
app.use(express.json())
app.use("Images", express.static("./Images"))

app.use("/register", registerRoute)
app.use("/login", loginRoute)
app.use("/logOut", logOutRoute)
app.use("/verification", verifyEmailRoute)
//seller side work
app.use("/products", productRouter)
app.use("/coupan", coupanRouter)
//buyer side 
app.use("/cart", verifyToken ,cartRouter)
app.use("/search-products", searchProductRouter)

app.listen(process.env.PORT, async(req, res) => {
  await sequelize.authenticate()
})