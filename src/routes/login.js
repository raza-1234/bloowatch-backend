const Express = require("express")
const router = Express.Router()
const {logIn} = require("../controllers/login")

router.post("/", logIn)

module.exports = router